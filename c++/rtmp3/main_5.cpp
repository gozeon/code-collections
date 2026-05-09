#include <iostream>
#include <atomic>
#include <string>
#include <thread>
#include <fstream>
#include <filesystem>

#include <sys/mman.h>
#include <fcntl.h>
#include <unistd.h>
#include <cstring>
#include <csignal>

#include "spdlog/spdlog.h"
#include "spdlog/sinks/stdout_color_sinks.h"

#include "lib/ada.h"

extern "C"
{
#include <librtmp/rtmp.h>
#include <librtmp/log.h>
}

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

// 解析path
std::string parse_storage_path(const std::string &url_str)
{
	// 解析 URL
	auto url = ada::parse<ada::url_aggregator>(url_str);

	if (!url)
	{
		return "default_record";
	}

	// 获取路径部分 (例如 "/tjradio/XIANGSHENG")
	std::string path = std::string(url->get_pathname());

	// 去掉开头的 / 以便作为相对路径创建目录
	if (!path.empty() && path[0] == '/')
	{
		path.erase(0, 1);
	}

	// 如果末尾有 / 也去掉
	if (!path.empty() && path.back() == '/')
	{
		path.pop_back();
	}

	return path.empty() ? "default_record" : path;
}

class MagicRingBuffer
{
private:
	uint8_t *m_buffer = nullptr;
	size_t m_capacity = 0;		   // 实际映射的物理大小（页面对齐）
	size_t m_head = 0;			   // 读偏移
	size_t m_tail = 0;			   // 写偏移
	std::atomic<size_t> m_size{0}; // 当前有效字节数

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

class RTMPWorker
{
private:
	std::shared_ptr<spdlog::logger> logger;
	std::string logId; // 区分日志名
	std::string rtmp_url;
	MagicRingBuffer mrb;

	// 文件写入的目录
	std::filesystem::path outpath;

	// 线程对象
	std::jthread prod_thread;
	std::jthread cons_thread;

	// 线程同步
	std::mutex mtx;
	std::condition_variable cv;

public:
	RTMPWorker(const std::string &logId, const std::string &rtmp_url, size_t buffer_size) : logId(logId), rtmp_url(rtmp_url), mrb(buffer_size)
	{
		logger = spdlog::stdout_color_mt(logId);
		// logger->set_level(spdlog::level::debug);

		outpath = std::filesystem::current_path() / "records" / parse_storage_path(rtmp_url);
		if (!std::filesystem::exists(outpath))
		{
			std::filesystem::create_directories(outpath);
			logger->info("创建目录: {}", outpath.string());
		}
	}
	~RTMPWorker()
	{
		cv.notify_all();
	}
	void start(std::stop_token global_token)
	{
		cons_thread = std::jthread([this, global_token]()
								   { consumer_task(global_token); });
		prod_thread = std::jthread([this, global_token]()
								   { producer_task(global_token); });
	}

private:
	void producer_task(std::stop_token stoken)
	{
		logger->info("producer_task 开始工作");

		RTMP_LogSetLevel(RTMP_LOGINFO);
		// RTMP_LogSetLevel(RTMP_LOGDEBUG);

		int retry_count = {};
		const int MAX_SLEEP_SEC = 30;
		std::uint8_t buffer[16 * 1024];

		while (!stoken.stop_requested())
		{
			RTMP *rtmp = RTMP_Alloc();
			RTMP_Init(rtmp);
			// 设置读取超时（防止网络僵死时线程永久阻塞）
			rtmp->Link.timeout = 10;
			if (!RTMP_SetupURL(rtmp, (char *)rtmp_url.c_str()) || !RTMP_Connect(rtmp, NULL) || !RTMP_ConnectStream(rtmp, 0))
			{
				logger->error("无法连接： {}", rtmp_url);
				RTMP_Free(rtmp);
				retry_count++;

				// 指数退避或简单休眠，防止 CPU 飙升
				// 计算等待时间：重试越多等越久，上限 30s
				int sleep_sec = std::min(retry_count * 2, MAX_SLEEP_SEC);
				for (int i = 0; i < sleep_sec && !stoken.stop_requested(); ++i)
				{
					std::this_thread::sleep_for(std::chrono::seconds(1));
				}

				continue;
			}

			retry_count = 0;
			// 添加读取时间，防止read假死
			auto last_read_time = std::chrono::steady_clock::now();
			const auto read_timeout_threshold = std::chrono::seconds(20);

			while (!stoken.stop_requested())
			{
				auto before_read = std::chrono::steady_clock::now();
				// 假死检测：基于“现在”和“上一次成功读取”的时间差
				if (before_read - last_read_time > read_timeout_threshold)
				{
					logger->error("RTMP_Read {} 秒无数据，准备重连", read_timeout_threshold.count());
					break;
				}

				int readSize = RTMP_Read(rtmp, reinterpret_cast<char *>(buffer), sizeof(buffer));
				if (readSize <= 0)
				{
					logger->error("RTMP_Read 返回异常，准备重连");
					break;
				}

				last_read_time = std::chrono::steady_clock::now();

				logger->debug("RTMP_Read 读取 {} 数据", readSize);
				{
					// 保护 push 操作，并配合 condition_variable
					// std::lock_guard 一旦创建，立即锁住 mutex；直到它生命周期结束（出花括号），自动释放, 不可手动解锁，不可中途重新加锁
					std::lock_guard<std::mutex> lock(mtx);
					if (!mrb.push(buffer, readSize))
					{
						// 缓冲区满了，简单丢弃或处理
						logger->warn("缓冲区满了!");
					}
				}

				cv.notify_one();
			}

			logger->warn("正在清理当前连接资源...");
			RTMP_Close(rtmp);
			RTMP_Free(rtmp);

			std::this_thread::sleep_for(std::chrono::seconds(2));
		}

		cv.notify_all();
		logger->info("producer_task 结束工作");
	}
	void consumer_task(std::stop_token stoken)
	{
		logger->info("consumer_task 开始工作");
		std::vector<std::uint8_t> flv_header;
		std::vector<std::uint8_t> pending_tags; // 存放第一个关键帧之前的“孤儿”数据
		std::vector<uint8_t> cached_metadata;	// 存储 Metadata
		std::vector<uint8_t> cached_v_config;	// 存储 SPS/PPS
		std::vector<uint8_t> cached_a_config;	// AudioConfig

		std::ofstream outFile = {};

		while (true)
		{
			// std::unique_lock 是 lock_guard 的增强版 除了自动加锁解锁，它允许你手动调用 lock() 和 unlock()
			// 配合 std::condition_variable
			std::unique_lock<std::mutex> lock(mtx);
			// 等待直到有数据，或者程序停止
			cv.wait(lock, [&]
					{ return mrb.size() >= 13 || stoken.stop_requested(); });

			if (stoken.stop_requested())
			{
				auto rest_size = mrb.size();
				logger->warn("收到停止信号, 还有 {} 数据未处理!", rest_size);
				// 如果当前文件打开，全部写入
				if (outFile.is_open() && rest_size > 0)
				{
					uint8_t *ptr = mrb.get_read_ptr();
					outFile.write(reinterpret_cast<const char *>(ptr), mrb.size());
				}
				break;
			}

			// 关键点：手动解锁！
			// 既然我们已经确认有数据了，接下来的打印和解析不需要占着锁
			// 如果不解锁，会等消费完了，才会push数据
			lock.unlock();

			uint8_t *ptr = mrb.get_read_ptr();
			if (ptr[0] == 'F' && ptr[1] == 'L' && ptr[2] == 'V')
			{
				logger->debug("cache flv header");
				flv_header.assign(ptr, ptr + 13);
				mrb.pop(13);

				// 说明重连了，清理之前的数据
				cached_metadata.clear();
				cached_a_config.clear();
				cached_v_config.clear();
				pending_tags.clear();

				if (outFile.is_open())
				{
					outFile.close();
				}
			}
			else
			{
				uint8_t *ptr = mrb.get_read_ptr();
				// 解析 Tag Header 中的 DataSize (Tag 第 2, 3, 4 字节)
				// FLV 大端字节序转换为主机字节序
				std::uint32_t data_size = (ptr[1] << 16) | (ptr[2] << 8) | ptr[3];
				// 计算此 Tag 的总长度：11(Header) + 数据体(data_size) + 4(PreviousTagSize)
				uint32_t total_tag_len = 11 + data_size + 4;
				// 如果当前缓冲区数据不足以构成一个完整的 Tag，立即跳出，等待下一次读取补齐
				if (mrb.size() < total_tag_len)
				{
					logger->warn("数据不满足完整tag");
					continue;
				}
				logger->debug("Tag type: {:#04x} , size: {}", ptr[0], data_size);

				// 匿名函数，写入文件 or 存入pendding tag
				auto write_or_cache = [&]()
				{
					if (outFile.is_open())
					{
						outFile.write(reinterpret_cast<const char *>(ptr), total_tag_len);
					}
					else
					{
						// 程序启动，还没有遇到关键帧，就没有文件，先存起来
						pending_tags.insert(pending_tags.end(), ptr, ptr + total_tag_len);

						// 防御：防止一直等不到关键帧导致内存溢出
						if (pending_tags.size() > 20 * 1024 * 1024)
						{
							pending_tags.clear();
						}
					}

					mrb.pop(total_tag_len);
				};

				// 到这肯定有一个完整的的tag了
				// 0-10   11字节 Tag Header包含 Tag 类型 (0x09)、长度、时间戳等。
				// 11     1 字节   FrameType & CodecID检测关键帧的位置。高4位为 1 是关键帧。
				// 12     1 字节   AVCPacketType区分是配置信息 (0) 还是实际数据 (1)。
				// 13-15  3 字节   CompositionTime视频合成时间偏移 (CTS)
				std::uint8_t tag_type = ptr[0];

				if (tag_type == 0x12)
				{
					logger->debug("Tag type is metadata");
					cached_metadata.assign(ptr, ptr + total_tag_len);
					mrb.pop(total_tag_len);
				}
				else if (tag_type == 0x08)
				{
					logger->debug("Tag type is audio");

					// AAC Sequence Header
					if (ptr[12] == 0)
					{
						cached_a_config.assign(ptr, ptr + total_tag_len);
						mrb.pop(total_tag_len);
					}
					else
					{
						write_or_cache();
					}
				}
				else if (tag_type == 0x09)
				{
					logger->debug("Tag type is video");
					// 0: Config, 1: NALU
					std::uint8_t packet_type = ptr[12];
					if (packet_type == 0)
					{
						cached_v_config.assign(ptr, ptr + total_tag_len);
						mrb.pop(total_tag_len);
					}
					else if (packet_type == 1)
					{
						std::uint8_t frame_type = (ptr[11] >> 4) & 0x0f;
						if (frame_type == 1)
						{
							// keyframe
							if (outFile.is_open())
							{
								outFile.close();
							}
							// seqment file
							// 获取当前本地时间，精确到毫秒防止重连过快导致重名
							auto now = std::chrono::system_clock::now();
							std::string filename = std::format("{:%Y%m%d_%H%M%S}.flv", now);
							std::filesystem::path filepath = outpath / filename;
							outFile.open(filepath, std::ios::binary);

							if (!flv_header.empty())
							{
								outFile.write(reinterpret_cast<char *>(flv_header.data()), flv_header.size());
							}
							if (!cached_metadata.empty())
							{
								outFile.write(reinterpret_cast<char *>(cached_metadata.data()), cached_metadata.size());
							}
							if (!cached_v_config.empty())
							{
								outFile.write(reinterpret_cast<char *>(cached_v_config.data()), cached_v_config.size());
							}
							if (!cached_a_config.empty())
							{
								outFile.write(reinterpret_cast<char *>(cached_a_config.data()), cached_a_config.size());
							}
							if (!pending_tags.empty())
							{
								outFile.write(reinterpret_cast<char *>(pending_tags.data()), pending_tags.size());
								pending_tags.clear();
							}

							logger->info("写入文件: {}", filepath.string());
						}

						write_or_cache();
					}
				}
				else
				{
					// other
					write_or_cache();
				}
			}

			logger->debug("还剩 {} ", mrb.size());
		}

		if (outFile.is_open())
		{
			outFile.close();
		}
		logger->info("consumer_task 结束工作");
	}
};

int main()
{
	std::signal(SIGINT, signal_handler);

	std::vector<std::unique_ptr<RTMPWorker>> workers = {};
	std::vector<std::string> streams = {
		"rtmp://host.docker.internal:11935/stream/test",

	};
	for (size_t i = 0; i < streams.size(); i++)
	{
		const std::string logId = "stream_" + std::to_string(i);

		// 直接构造并放入 vector，效率最高
		workers.emplace_back(std::make_unique<RTMPWorker>(logId, streams[i], 4 * 1024 * 1024));
		// 立即启动最后一个加入的 worker
		workers.back()->start(global_stop_source.get_token());
	}

	while (!global_stop_source.stop_requested())
	{
		std::this_thread::sleep_for(std::chrono::microseconds(100));
	}

	return 0;
}