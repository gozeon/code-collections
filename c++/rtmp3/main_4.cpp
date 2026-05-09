#include <iostream>
#include <atomic>
#include <string>
#include <thread>

#include <sys/mman.h>
#include <fcntl.h>
#include <unistd.h>
#include <cstring>
#include <csignal>

#include "spdlog/spdlog.h"
#include "spdlog/sinks/stdout_color_sinks.h"

// 使用原子变量确保多线程安全
std::stop_source global_stop_source;

void signal_handler(int signal)
{
	if (signal == SIGINT)
	{
		std::cout << "Ctrl+C, exit." << std::endl;

		global_stop_source.request_stop();
	}
}

class MagicRingBuffer
{
private:
	uint8_t *m_buffer = nullptr;
	size_t m_capacity = 0; // 实际映射的物理大小（页面对齐）
	size_t m_head = 0;	   // 读偏移
	size_t m_tail = 0;	   // 写偏移
	// size_t m_size = 0;	   // 当前有效字节数
	std::atomic<size_t> m_size{0};

public:
	// 构造函数：参数为请求的缓冲区大小
	explicit MagicRingBuffer(size_t min_capacity)
	{
		size_t page_size = sysconf(_SC_PAGESIZE);
		// 1. 向上对齐到页面大小（4KB的倍数）
		m_capacity = (min_capacity + page_size - 1) & ~(page_size - 1);

		// 2. 创建内存文件描述符（只存在于内存中）
		int fd = memfd_create("magic_ring_buffer", 0);
		if (fd == -1)
			throw std::runtime_error("memfd_create failed");
		if (ftruncate(fd, m_capacity) == -1)
			throw std::runtime_error("ftruncate failed");

		// 3. 预留 2 倍大小的虚拟地址空间（占座）
		m_buffer = (uint8_t *)mmap(nullptr, 2 * m_capacity, PROT_NONE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
		if (m_buffer == MAP_FAILED)
			throw std::runtime_error("Initial mmap failed");

		// 4. 将物理内存映射到前半部分地址段
		if (mmap(m_buffer, m_capacity, PROT_READ | PROT_WRITE, MAP_SHARED | MAP_FIXED, fd, 0) == MAP_FAILED)
			throw std::runtime_error("First half mmap failed");

		// 5. 将物理内存再次映射到紧挨着的后半部分地址段
		if (mmap(m_buffer + m_capacity, m_capacity, PROT_READ | PROT_WRITE, MAP_SHARED | MAP_FIXED, fd, 0) == MAP_FAILED)
			throw std::runtime_error("Second half mmap failed");

		close(fd); // 映射完成后可关闭 fd
	}

	~MagicRingBuffer()
	{
		if (m_buffer)
			munmap(m_buffer, 2 * m_capacity);
	}

	// --- 写入操作 ---
	// 优点：不需要考虑跨越末尾的情况，直接 memcpy
	// 线程 A (生产者) 调用
	bool push(const uint8_t *data, size_t len)
	{
		// 使用 acquire 语义读取 size，确保看到线程 B 最新的 pop 结果
		if (m_size.load(std::memory_order_acquire) + len > m_capacity)
			return false; // 溢出检查

		std::memcpy(m_buffer + m_tail, data, len);
		m_tail = (m_tail + len) % m_capacity;

		// 使用 release 语义增加 size，确保数据写入动作对线程 B 可见
		m_size.fetch_add(len, std::memory_order_release);
		return true;
	}

	// --- 读取与删除操作 ---
	// 返回当前可读数据的连续指针
	// 线程 B (消费者)
	uint8_t *get_read_ptr() const
	{
		return m_buffer + m_head;
	}

	// 获取当前存储的数据长度
	size_t size() const
	{
		// 使用 acquire 语义读取，确保看到线程 A 最新的 push 数据
		return m_size.load(std::memory_order_acquire);
	}

	// 删除（弹出）已处理的数据：仅移动指针，不搬运内存
	void pop(size_t len)
	{
		// 注意：这里读取的是原子变量
		size_t current_size = m_size.load(std::memory_order_relaxed);
		if (len > current_size)
			len = current_size;

		m_head = (m_head + len) % m_capacity;

		// 使用 release 语义减少 size
		m_size.fetch_sub(len, std::memory_order_release);
	}

	size_t capacity() const { return m_capacity; }
};

class Worker
{
private:
	std::shared_ptr<spdlog::logger> logger;
	std::string logId; // 区分日志名
	MagicRingBuffer mrb;

	// 线程对象
	std::jthread prod_thread;
	std::jthread cons_thread;

	// 线程同步
	std::mutex mtx;
	std::condition_variable cv;

public:
	Worker(const std::string &logId) : logId(logId), mrb(4 * 1024 * 1024)
	{
		logger = spdlog::stdout_color_mt(logId);
	}
	~Worker()
	{
		logger->info("Worker 正在析构...");
		cv.notify_all();
	}
	void start(std::stop_token global_token)
	{
		prod_thread = std::jthread([this, global_token]()
								   { producer_task(global_token); });
		cons_thread = std::jthread([this, global_token]()
								   { consumer_task(global_token); });
	}

private:
	void producer_task(std::stop_token stoken)
	{
		logger->info("producer_task 开始工作");

		uint8_t mock_data = 0;
		while (!stoken.stop_requested())
		{
			// 模拟网络读取了一段数据 (比如 1024 字节)
			std::vector<uint8_t> buffer(1034);
			std::fill(buffer.begin(), buffer.end(), mock_data++);

			logger->info("生产数据");
			{
				// 保护 push 操作，并配合 condition_variable
				// std::lock_guard 一旦创建，立即锁住 mutex；直到它生命周期结束（出花括号），自动释放, 不可手动解锁，不可中途重新加锁
				std::lock_guard<std::mutex> lock(mtx);
				if (!mrb.push(buffer.data(), buffer.size()))
				{
					// 缓冲区满了，简单丢弃或处理
					logger->warn("缓冲区满了!");
				}
			}

			// 唤醒解析线程
			cv.notify_one();

			// 模拟网络间隔

			std::this_thread::sleep_for(std::chrono::microseconds(2));
		}

		cv.notify_all();
		logger->info("producer_task 结束工作");
	}
	void consumer_task(std::stop_token stoken)
	{
		logger->info("consumer_task 开始工作");

		while (true)
		{
			// std::unique_lock 是 lock_guard 的增强版 除了自动加锁解锁，它允许你手动调用 lock() 和 unlock()
			// 配合 std::condition_variable
			std::unique_lock<std::mutex> lock(mtx);
			// 等待直到有数据，或者程序停止
			cv.wait(lock, [&]
					{ return mrb.size() >= 1024 || stoken.stop_requested(); });

			if (stoken.stop_requested())
			{
				logger->warn("收到停止信号, 还有 {} 数据未处理!", mrb.size());
				break;
			}

			// 关键点：手动解锁！
			// 既然我们已经确认有数据了，接下来的打印和解析不需要占着锁
			// 如果不解锁，会等消费完了，才会push数据
			lock.unlock();

			logger->info("处理 1024 字节");
			uint8_t *ptr = mrb.get_read_ptr();
			logger->info("{}", ptr[0]);
			mrb.pop(1024);
			logger->info("还剩下 {} 字节", mrb.size());
		}

		logger->info("consumer_task 结束工作");
	}
};

int main()
{
	std::signal(SIGINT, signal_handler);

	std::vector<std::unique_ptr<Worker>> workers = {};
	std::vector<std::string> streams = {
		"rtmp://host.docker.internal:11935/stream/test",
		"rtmp://host.docker.internal:11935/stream/test",
		"rtmp://host.docker.internal:11935/stream/test",
	};
	for (size_t i = 0; i < streams.size(); i++)
	{
		const std::string logId = "stream_" + std::to_string(i);
		// auto worker = std::make_unique<Worker>(logId);
		// // 使用 std::move 转移所有权
		// workers.push_back(std::move(worker));

		// 直接构造并放入 vector，效率最高
		workers.emplace_back(std::make_unique<Worker>(logId));
		// 立即启动最后一个加入的 worker
		workers.back()->start(global_stop_source.get_token());
	}

	while (!global_stop_source.stop_requested())
	{
		std::this_thread::sleep_for(std::chrono::microseconds(100));
	}

	return 0;
}