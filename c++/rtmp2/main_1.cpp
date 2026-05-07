#include <iostream>
#include <fstream>
#include <print>
#include <vector>
#include <filesystem>
#include <cstdio>
#include <expected>

enum class my_error
{
	none = 0,
	invalid_input,
	header_invalid_format,
	flv_file_invalid_format,

	not_found,		   // 文件不存在
	permission_denied, // 权限不足
	open_failed,	   // 打开失败（未知原因）
	invalid_format,	   // 内容格式错误（如非 JSON, 非数字等）
	unexpected_eof,	   // 意外的文件读取结束
	out_of_range	   // 数据超出范围（如数值过大）
};

auto parse_flv_step_by_step(std::filesystem::path &file_path) -> std::expected<int, my_error>
{
	// 检查文件是否存在且是常规文件
	if (!std::filesystem::exists(file_path) || !std::filesystem::is_regular_file(file_path))
	{
		return std::unexpected(my_error::invalid_input);
	}

	std::ifstream file(file_path, std::ios::binary);

	if (!file)
	{
		return std::unexpected(my_error::open_failed);
	}

	std::println("解析header");

	// 读取header
	std::uint8_t header[9];
	// reinterpret_cast 把这一块内存中的比特（Bits）直接看作另一种类型
	if (!file.read(reinterpret_cast<char *>(header), 9))
	{
		return std::unexpected(my_error::header_invalid_format);
	}

	// 使用 C++20 验证签名
	std::string signature(reinterpret_cast<char *>(header), 3);
	if (signature != "FLV")
	{
		return std::unexpected(my_error::flv_file_invalid_format);
	}

	std::uint8_t flags = header[4];
	bool hasAudio = flags & 0x04;
	bool hasVideo = flags & 0x01;

	std::println("header 解析成功: 音频({}), 视频({})", hasAudio, hasVideo);

	std::println("解析tag");
	/*
	int tagCount = {};
	while (true)
	{
		// 读取 PreviousTagSize (4 字节)
		std::uint8_t prevTagSizeBuf[4];
		if (!file.read(reinterpret_cast<char *>(prevTagSizeBuf), 4))
		{
			break;
		}

		// 读取 Tag Header (11 字节)
		std::uint8_t tagHeader[11];
		if (!file.read(reinterpret_cast<char *>(tagHeader), 11))
		{
			break;
		}

		// 解析 Tag 类型
		std::uint8_t type = tagHeader[0];

		// 解析 DataSize (大端序 3 字节，第 1-3 字节)
		std::uint32_t dataSize = (static_cast<std::uint32_t>(tagHeader[1]) << 16) |
								 (static_cast<std::uint32_t>(tagHeader[2]) << 8) |
								 (static_cast<std::uint32_t>(tagHeader[3]));

		std::println("找到 Tag[{}]：类型({:#04x}), 数据大小({} 字节)", tagCount++, type, dataSize);

		// 如果我们只想数数量，不想要数据，直接跳过 dataSize 字节
		file.seekg(dataSize, std::ios::cur);

		// 如果你想读出数据，可以这样：
		// std::vector<std::uint8_t> payload(dataSize);
		// file.read(reinterpret_cast<char*>(payload.data()), dataSize);

		if(tagCount > 10) {
			break;
		}
	}
	*/

	// 前面读了9字节，现在需要从当前位置跳4字节
	file.seekg(4, std::ios::cur);

	int audioCount = {};
	int keyFrameCount = {};
	int videoCount = {};
	int metaCount = {};
	while (true)
	{
		std::uint8_t tagHeader[11];
		if (!file.read(reinterpret_cast<char *>(tagHeader), 11))
		{
			break;
		}

		// tag类型
		std::uint8_t tagType = tagHeader[0];
		// datasize（第1-3字节）
		std::uint32_t dataSize = (tagHeader[1] << 16) | (tagHeader[2] << 8) | tagHeader[3];
		// 时间戳 (第4-7字节，公式：(Ext << 24) | (T2 << 16) | (T1 << 8) | T0)
		std::uint32_t timestamp = (tagHeader[7] << 24) | (tagHeader[4] << 16) | (tagHeader[5] << 8) | tagHeader[6];

		switch (tagType)
		{
		case 0x12: // Script Data (Metadata)
			metaCount++;
			std::println("[Metadata] 时间戳: {}ms, 大小: {} 字节", timestamp, dataSize);
			break;

		case 0x09: // Video
			videoCount++;
			// 进一步解析：读取视频数据的第一字节查看帧类型
			// 注意：这里只是为了演示，读取后需要 seekg 回去或补偿偏移
			// uint8_t videoInfo; file.read((char*)&videoInfo, 1); file.seekg(-1, ios::cur);
			std::uint8_t frameType;
			file.read((char *)&frameType, 1);
			file.seekg(-1, std::ios::cur);

			// 0x17 (关键帧 + H.264)  0x27 (非关键帧 + H.264)
			if (frameType == 0x17)
			{
				keyFrameCount++;
			}
			break;

		case 0x08: // Audio
			audioCount++;
			break;

		default:
			std::println("[Unknown ]  类型: {:#04x}\n", tagType);
			break;
		}
		// 跳过数据部分 + 下一个 PreviousTagSize (4字节)
		file.seekg(dataSize + 4, std::ios::cur);

		// 限制一下输出，防止刷屏
		// if (audioCount + videoCount > 1000)
		// 	break;
	}

	std::println("{} 视频({} 关键帧)， {} 音频", videoCount, keyFrameCount, audioCount);
	return 0;
}

int main()
{
	std::filesystem::path p = std::filesystem::current_path() / "test.flv";
	parse_flv_step_by_step(p);
}
