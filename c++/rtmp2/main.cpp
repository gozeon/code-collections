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

	std::uint8_t buffer[64 * 1024];
	std::vector<std::uint8_t> byte_queue;
	std::vector<std::uint8_t> flv_header;
	std::vector<std::uint8_t> config_tags;	// 存储 Metadata/SPS/PPS/AudioConfig
	std::vector<std::uint8_t> pending_tags; // 存放第一个关键帧之前的“孤儿”数据
	bool header_skipped = false;
	std::ofstream outFile = {};
	int retry_count = {};
	const int MAX_SLEEP_SEC = 30;

	while (!stoken.stop_requested())
	{
		// 重置状态
		header_skipped = false;
		byte_queue.clear();
		flv_header.clear();
		config_tags.clear();
		pending_tags.clear();
		if (outFile.is_open())
		{
			outFile.flush();
			outFile.close();
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
				spdlog::error("[错误] RTMP_Read {} 秒无数据，准备重连", read_timeout_threshold.count());
				break;
			}
			int readSize = RTMP_Read(rtmp, reinterpret_cast<char *>(buffer), sizeof(buffer));
			if (readSize <= 0)
			{
				spdlog::error("[错误] RTMP_Read 返回异常，准备重连");
				break;
			}
			last_read_time = read_now;

			// 新数据插入队尾
			byte_queue.insert(byte_queue.end(), buffer, buffer + readSize);

			// 处理header
			if (!header_skipped && byte_queue.size() >= 13)
			{
				// 判断是不是 flv header
				if (byte_queue[0] == 'F' && byte_queue[1] == 'L' && byte_queue[2] == 'V')
				{
					flv_header.assign(byte_queue.begin(), byte_queue.begin() + 13);
					byte_queue.erase(byte_queue.begin(), byte_queue.begin() + 13);
					header_skipped = true;
				}
			}

			// 消费队列里的数据
			while (header_skipped && byte_queue.size() >= 11)
			{
				// 解析 Tag Header 中的 DataSize (Tag 第 2, 3, 4 字节)
				// FLV 大端字节序转换为主机字节序
				std::uint32_t data_size = (byte_queue[1] << 16) | (byte_queue[2] << 8) | byte_queue[3];

				// 计算此 Tag 的总长度：11(Header) + 数据体(data_size) + 4(PreviousTagSize)
				uint32_t total_tag_len = 11 + data_size + 4;

				// 如果当前缓冲区数据不足以构成一个完整的 Tag，立即跳出，等待下一次读取补齐
				if (byte_queue.size() < total_tag_len)
				{
					break;
				}

				// 到这肯定有一个完整的的tag了
				// 0-10   11字节 Tag Header包含 Tag 类型 (0x09)、长度、时间戳等。
				// 11     1 字节   FrameType & CodecID检测关键帧的位置。高4位为 1 是关键帧。
				// 12     1 字节   AVCPacketType区分是配置信息 (0) 还是实际数据 (1)。
				// 13-15  3 字节   CompositionTime视频合成时间偏移 (CTS)
				std::uint8_t tag_type = byte_queue[0];
				bool is_video = (tag_type == 0x09);
				bool is_audio = (tag_type == 0x08);
				bool is_metadata = (tag_type == 0x12);

				bool is_keyframe = false;
				bool is_config = false;

				if (is_video)
				{
					std::uint8_t frame_type = (byte_queue[11] >> 4) & 0x0f;
					// 0: Config, 1: NALU
					std::uint8_t packet_type = byte_queue[12];

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
					if (byte_queue[12] == 0)
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
					config_tags.insert(config_tags.end(), byte_queue.begin(), byte_queue.begin() + total_tag_len);
				}

				if (is_keyframe)
				{
					// 如果文件已经开了，且遇到了【下一个】关键帧，则执行切换
					outFile.close();

					// 获取当前本地时间，精确到毫秒防止重连过快导致重名
					auto now = std::chrono::system_clock::now();
					std::string filename = std::format("{:%Y%m%d_%H%M%S}.flv", now);

					std::filesystem::path filepath = std::filesystem::current_path() / storagePath / filename;
					outFile.open(filepath, std::ios::binary);
					if (!flv_header.empty())
					{
						outFile.write(reinterpret_cast<char *>(flv_header.data()), flv_header.size());
					}

					if (!config_tags.empty())
					{
						outFile.write(reinterpret_cast<char *>(config_tags.data()), config_tags.size());
					}

					// 将之前暂存的非关键帧数据全部合并进来
					if (!pending_tags.empty())
					{
						outFile.write(reinterpret_cast<char *>(pending_tags.data()), pending_tags.size());
						pending_tags.clear();
					}

					spdlog::info("生成文件: {}", filepath.string());
				}

				if (outFile.is_open())
				{
					outFile.write(reinterpret_cast<const char *>(byte_queue.data()), total_tag_len);
				}
				else
				{
					pending_tags.insert(pending_tags.end(), byte_queue.begin(), byte_queue.begin() + total_tag_len);

					// 防御：防止一直等不到关键帧导致内存溢出
					if (pending_tags.size() > 20 * 1024 * 1024)
					{
						pending_tags.clear();
					}
				}

				// 清除队列tag
				byte_queue.erase(byte_queue.begin(), byte_queue.begin() + total_tag_len);
			}
		}

		spdlog::warn("正在清理当前连接资源...");
		RTMP_Close(rtmp);
		RTMP_Free(rtmp);
		// 重连前的缓冲等待，避免在断网情况下死循环尝试
		std::this_thread::sleep_for(std::chrono::seconds(2));
	}

	if (outFile.is_open())
	{
		outFile.close();
	}

	spdlog::info("成功退出...");
}

int main()
{
	spdlog::set_pattern("[%Y-%m-%d %H:%M:%S.%e] [thread %t] [%^%l%$] %v");
	std::signal(SIGINT, signal_handler);

	std::vector<std::string> streams = {
		"rtmp://host.docker.internal:11935/stream/test",
		"rtmp://host.docker.internal:11935/stream/test",
		"rtmp://host.docker.internal:11935/stream/test",
		"rtmp://host.docker.internal:11935/stream/test"};

	for (const auto &stream : streams)
	{
		std::jthread t(
			record_rtmp,
			global_stop_source.get_token(),
			stream);
	}

	spdlog::info("成功启动{}个录制线程", streams.size());

	return 0;
}
