#include <iostream>
#include <atomic>
#include <string>
#include <thread>
#include <fstream>
#include <filesystem>
#include <format>
#include <bit>

#include "spdlog/spdlog.h"

extern "C"
{
#include <librtmp/rtmp.h>
#include <librtmp/log.h>
}

int main()
{
	const std::string rtmp_url = "rtmp://host.docker.internal:11935/stream/test";
	RTMP_LogSetLevel(RTMP_LOGINFO);
	// RTMP_LogSetLevel(RTMP_LOGDEBUG);
	RTMP *rtmp = RTMP_Alloc();
	RTMP_Init(rtmp);
	rtmp->Link.timeout = 10;
	if (!RTMP_SetupURL(rtmp, (char *)rtmp_url.c_str()) || !RTMP_Connect(rtmp, NULL) || !RTMP_ConnectStream(rtmp, 0))
	{
		spdlog::error("无法连接： {}", rtmp_url);
		RTMP_Free(rtmp);
	}

	std::ofstream outFile = {};
	std::vector<std::uint8_t> flvHeader = {
		'F',
		'L',
		'V',
		0x01,
		0x05,
		0x00,
		0x00,
		0x00,
		0x09,

		0x00,
		0x00,
		0x00,
		0x00,
	};
	std::vector<std::uint8_t> pending_tags;	   // 存放第一个关键帧之前的“孤儿”数据
	std::vector<std::uint8_t> cached_metadata; // 存储 Metadata
	std::vector<std::uint8_t> cached_v_config; // 存储 SPS/PPS
	std::vector<std::uint8_t> cached_a_config; // AudioConfig

	int count = 0;
	RTMPPacket rp;
	while (RTMP_IsConnected(rtmp) && RTMP_ReadPacket(rtmp, &rp))
	{
		count++;
		if (count > 5000)
		{
			break;
		}

		// rp.m_nBodySize == rp.m_nBytesRead
		if (RTMPPacket_IsReady(&rp))
		{
			std::uint8_t tagHeader[11];
			tagHeader[0] = rp.m_packetType;

			tagHeader[1] = (rp.m_nBodySize >> 16) & 0xFF;
			tagHeader[2] = (rp.m_nBodySize >> 8) & 0xFF;
			tagHeader[3] = (rp.m_nBodySize) & 0xFF;

			tagHeader[4] = (rp.m_nTimeStamp >> 16) & 0xFF;
			tagHeader[5] = (rp.m_nTimeStamp >> 8) & 0xFF;
			tagHeader[6] = (rp.m_nTimeStamp) & 0xFF;
			tagHeader[7] = (rp.m_nTimeStamp >> 24) & 0xFF;

			tagHeader[8] = tagHeader[9] = tagHeader[10] = 0;

			std::uint32_t preTagSize = 11 + rp.m_nBodySize;
			std::uint8_t preSizeBuf[4];
			preSizeBuf[0] = (preTagSize >> 24) & 0xFF;
			preSizeBuf[1] = (preTagSize >> 16) & 0xFF;
			preSizeBuf[2] = (preTagSize >> 8) & 0xFF;
			preSizeBuf[3] = (preTagSize) & 0xFF;

			auto save_to_cache = [&](std::vector<std::uint8_t> &cache, bool clear)
			{
				if (clear)
				{
					cache.clear();
				}

				cache.insert(cache.end(), tagHeader, tagHeader + 11);
				cache.insert(cache.end(), rp.m_body, rp.m_body + rp.m_nBodySize);
				cache.insert(cache.end(), preSizeBuf, preSizeBuf + 4);
			};

			// 判断是否是配置包 (Sequence Headers)
			// AVC Sequence Header
			bool is_v_config = (rp.m_packetType == RTMP_PACKET_TYPE_VIDEO && rp.m_nBodySize > 2 &&
								(uint8_t)rp.m_body[0] == 0x17 && (uint8_t)rp.m_body[1] == 0x00);

			// AAC Sequence Header
			bool is_a_config = (rp.m_packetType == RTMP_PACKET_TYPE_AUDIO && rp.m_nBodySize > 2 &&
								(uint8_t)rp.m_body[1] == 0x00);

			bool is_metadata = (rp.m_packetType == RTMP_PACKET_TYPE_INFO);

			// 判断是否是关键帧 (用于拆分)
			bool is_keyframe = (rp.m_packetType == RTMP_PACKET_TYPE_VIDEO && rp.m_nBodySize > 0 &&
								((uint8_t)rp.m_body[0] & 0xF0) == 0x10 && (uint8_t)rp.m_body[1] != 0x00);

			if (is_metadata)
			{
				save_to_cache(cached_metadata, true);
			}
			else if (is_v_config)
			{
				save_to_cache(cached_v_config, true);
			}
			else if (is_a_config)
			{
				save_to_cache(cached_a_config, true);
			}

			if (is_keyframe)
			{
				if (outFile.is_open())
				{
					outFile.close();
				}
				// 拆分文件
				auto now = std::chrono::system_clock::now();
				std::string filename = std::format("{:%Y%m%d_%H%M%S}.flv", now);
				std::filesystem::path filepath = std::filesystem::current_path() / filename;
				outFile.open(filepath, std::ios::binary);

				if (!flvHeader.empty())
				{
					outFile.write(reinterpret_cast<const char *>(flvHeader.data()), flvHeader.size());
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
				spdlog::info("写入文件: {}", filepath.string());
			}

			if (outFile.is_open())
			{
				outFile.write(reinterpret_cast<char *>(tagHeader), 11);
				outFile.write(rp.m_body, rp.m_nBodySize);
				outFile.write(reinterpret_cast<char *>(preSizeBuf), 4);
			}
			else
			{
				save_to_cache(pending_tags, false);
			}

			RTMPPacket_Free(&rp);
		}
	}

	if (outFile.is_open())
	{
		outFile.close();
	}

	RTMPPacket_Free(&rp);
	RTMP_Close(rtmp);
	RTMP_Free(rtmp);

	return 0;
}