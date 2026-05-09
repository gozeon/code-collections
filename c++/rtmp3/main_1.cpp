#include <iostream>
#include <fstream>
#include <vector>
#include <filesystem>
#include <atomic>
#include <csignal>
#include <format>
#include <chrono>
#include <string>
#include <thread>
#include <sys/mman.h>
#include <unistd.h>
#include <cstring>
#include <stdexcept>
#include <cstdint>
#include <fcntl.h>

#include "spdlog/spdlog.h"
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
		spdlog::warn("接收到 Ctrl+C，正在安全关闭...");

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
	size_t m_size = 0;	   // 当前有效字节数

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
	bool push(const uint8_t *data, size_t len)
	{
		if (m_size + len > m_capacity)
			return false; // 溢出检查

		std::memcpy(m_buffer + m_tail, data, len);
		m_tail = (m_tail + len) % m_capacity;
		m_size += len;
		return true;
	}

	// --- 读取与删除操作 ---
	// 返回当前可读数据的连续指针
	uint8_t *get_read_ptr() const
	{
		return m_buffer + m_head;
	}

	// 获取当前存储的数据长度
	size_t size() const { return m_size; }

	// 删除（弹出）已处理的数据：仅移动指针，不搬运内存
	void pop(size_t len)
	{
		if (len > m_size)
			len = m_size;
		m_head = (m_head + len) % m_capacity;
		m_size -= len;
	}

	size_t capacity() const { return m_capacity; }
};

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

void record_rtmp(std::stop_token stoken, const std::string &rtmp_url)
{

	std::string storagePath = "records/" + parse_storage_path(rtmp_url);
	if (!std::filesystem::exists(storagePath))
	{
		std::filesystem::create_directories(storagePath);
		spdlog::info("创建目录: {}", storagePath);
	}

	RTMP_LogSetLevel(RTMP_LOGINFO);
	// RTMP_LogSetLevel(RTMP_LOGDEBUG);

	std::uint8_t buffer[8 * 1024];
	MagicRingBuffer mrb{4 * 1024 * 1024};
	std::vector<std::uint8_t> flv_header;
	std::vector<std::uint8_t> config_tags;	// 存储 Metadata/SPS/PPS/AudioConfig
	std::vector<std::uint8_t> pending_tags; // 存放第一个关键帧之前的“孤儿”数据
	bool header_skipped = false;
	int outFd = -1;
	int retry_count = {};
	const int MAX_SLEEP_SEC = 30;

	while (!stoken.stop_requested())
	{
		// 重置状态
		header_skipped = false;
		mrb.pop(mrb.size());
		flv_header.clear();
		config_tags.clear();
		pending_tags.clear();

		if (outFd != -1)
		{
			::close(outFd);
			outFd = -1;
		}

		// 开始连接
		RTMP *rtmp = RTMP_Alloc();
		RTMP_Init(rtmp);
		// 设置读取超时（防止网络僵死时线程永久阻塞）
		rtmp->Link.timeout = 10;

		spdlog::info("正在连接: {}", rtmp_url);
		if (!RTMP_SetupURL(rtmp, (char *)rtmp_url.c_str()) || !RTMP_Connect(rtmp, NULL) || !RTMP_ConnectStream(rtmp, 0))
		{
			spdlog::error("无法连接： {}", rtmp_url);
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

		spdlog::info("正在读取流： {}", rtmp_url);
		retry_count = 0;
		// 添加读取时间，防止read假死
		auto last_read_time = std::chrono::steady_clock::now();
		const auto read_timeout_threshold = std::chrono::seconds(20);

		while (!stoken.stop_requested())
		{
			auto read_now = std::chrono::steady_clock::now();
			if (read_now - last_read_time > read_timeout_threshold)
			{
				spdlog::error("RTMP_Read {} 秒无数据，准备重连", read_timeout_threshold.count());
				break;
			}
			int readSize = RTMP_Read(rtmp, reinterpret_cast<char *>(buffer), sizeof(buffer));
			if (readSize <= 0)
			{
				spdlog::error("RTMP_Read 返回异常，准备重连");
				break;
			}

			// 计算时间
			auto diff = std::chrono::duration_cast<std::chrono::milliseconds>(read_now - last_read_time);
			spdlog::debug("RTMP_Read 间隔 {} ms", diff.count());

			last_read_time = read_now;

			spdlog::debug("RTMP_READ {} 字节数据", readSize);
			mrb.push(buffer, readSize);

			if (!header_skipped && mrb.size() >= 13)
			{
				uint8_t *ptr = mrb.get_read_ptr();

				if (ptr[0] == 'F' && ptr[1] == 'L' && ptr[2] == 'V')
				{
					flv_header.assign(ptr, ptr + 13);
					mrb.pop(13);
					header_skipped = true;
				}
			}

			// 消费队列里的数据
			while (header_skipped && mrb.size() >= 11)
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
					break;
				}

				// 到这肯定有一个完整的的tag了
				// 0-10   11字节 Tag Header包含 Tag 类型 (0x09)、长度、时间戳等。
				// 11     1 字节   FrameType & CodecID检测关键帧的位置。高4位为 1 是关键帧。
				// 12     1 字节   AVCPacketType区分是配置信息 (0) 还是实际数据 (1)。
				// 13-15  3 字节   CompositionTime视频合成时间偏移 (CTS)
				std::uint8_t tag_type = ptr[0];
				bool is_video = (tag_type == 0x09);
				bool is_audio = (tag_type == 0x08);
				bool is_metadata = (tag_type == 0x12);

				bool is_keyframe = false;
				bool is_config = false;

				if (is_video)
				{
					std::uint8_t frame_type = (ptr[11] >> 4) & 0x0f;
					// 0: Config, 1: NALU
					std::uint8_t packet_type = ptr[12];

					if (frame_type == 1 && packet_type == 1)
					{
						is_keyframe = true;
					}
					if (packet_type == 0)
					{
						is_config = true;
					}
				}
				else if (is_audio)
				{
					// AAC Sequence Header
					if (ptr[12] == 0)
					{
						is_config = true;
					}
				}
				else if (is_metadata)
				{
					is_config = true;
				}

				// 如果是配置信息，写入缓存
				if (is_config)
				{
					config_tags.assign(ptr, ptr + total_tag_len);
				}

				if (is_keyframe)
				{
					// 如果文件已经开了，且遇到了【下一个】关键帧，则执行切换
					if (outFd != -1)
					{
						::close(outFd);
					}

					// 获取当前本地时间，精确到毫秒防止重连过快导致重名
					auto now = std::chrono::system_clock::now();
					std::string filename = std::format("{:%Y%m%d_%H%M%S}.flv", now);

					std::filesystem::path filepath = std::filesystem::current_path() / storagePath / filename;
					// 使用系统调用 open
					// O_WRONLY: 只写; O_CREAT: 不存在则创建; O_TRUNC: 覆盖写入; 0644: 权限
					outFd = open(filepath.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0644);

					if (outFd != -1)
					{
						// 这在 Debian/EXT4 或 XFS 文件系统上非常有效, 预留2m空间
						// posix_fallocate(outFd, 0, 1 * 1024 * 1024);
						// 开启 Linux 顺序写入优化建议
						posix_fadvise(outFd, 0, 0, POSIX_FADV_SEQUENTIAL);

						if (!flv_header.empty())
						{
							::write(outFd, flv_header.data(), flv_header.size());
						}
						if (!config_tags.empty())
						{
							::write(outFd, config_tags.data(), config_tags.size());
						}

						// 将之前暂存的非关键帧数据全部合并进来
						if (!pending_tags.empty())
						{
							::write(outFd, pending_tags.data(), pending_tags.size());
							pending_tags.clear();
						}
						spdlog::info("已创建新文件 (fd: {}): {}", outFd, filepath.string());
					}
					else
					{
						spdlog::error("无法打开文件进行写入: {}", filepath.string());
					}
				}

				if (outFd != -1)
				{
					// 直接写入 Magic Ring Buffer 的指针数据，无需中转
					ssize_t bytes_written = ::write(outFd, ptr, total_tag_len);
					if (bytes_written == -1)
					{
						spdlog::error("写入磁盘失败，errno: {}", errno);
					}
				}
				else
				{
					pending_tags.insert(pending_tags.end(), ptr, ptr + total_tag_len);

					// 防御：防止一直等不到关键帧导致内存溢出
					if (pending_tags.size() > 20 * 1024 * 1024)
					{
						pending_tags.clear();
					}
				}

				mrb.pop(total_tag_len);
			}

			auto tag_now = std::chrono::steady_clock::now();
			spdlog::debug("tag_parse: {} ms", std::chrono::duration_cast<std::chrono::milliseconds>(tag_now - last_read_time).count());
		}

		spdlog::warn("正在清理当前连接资源...");
		RTMP_Close(rtmp);
		RTMP_Free(rtmp);
		// 重连前的缓冲等待，避免在断网情况下死循环尝试
		std::this_thread::sleep_for(std::chrono::seconds(2));
	}

	if (outFd != -1)
	{
		::close(outFd);
		outFd = -1;
	}

	spdlog::info("成功退出...");
}

int main()
{
	spdlog::set_level(spdlog::level::debug);
	spdlog::set_pattern("[%Y-%m-%d %H:%M:%S.%e] [thread %t] [%^%l%$] %v");
	std::signal(SIGINT, signal_handler);

	std::vector<std::jthread> workers;
	std::vector<std::string> streams = {
		"rtmp://host.docker.internal:11935/stream/test",
	};

	for (const auto &stream : streams)
	{
		workers.emplace_back(
			record_rtmp,
			global_stop_source.get_token(),
			stream);
	}

	spdlog::info("成功启动{}个录制线程", workers.size());

	return 0;
}
