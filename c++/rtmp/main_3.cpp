#include <iostream>
#include <fstream>
#include <vector>
#include <ctime>
#include <sstream>
#include <iomanip>
#include <filesystem>

#include "lib/ada.h"

extern "C"
{
#include <librtmp/rtmp.h>
#include <librtmp/log.h>
}

namespace fs = std::filesystem;

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

// 获取当前时间的字符串文件名
std::string get_current_filename(const std::string &baseDir)
{
    std::time_t now = std::time(nullptr);
    std::tm *ltm = std::localtime(&now);
    std::ostringstream oss;
    oss << baseDir << "/" << std::put_time(ltm, "%Y%m%d%H%M%S") << ".flv";
    return oss.str();
}

int main()
{
    const char *url = "rtmp://43.247.4.158:1935/tjradio/XIANGSHENG";
    // 路径
    std::string storagePath = "records/" + parse_storage_path(url);
    if (!fs::exists(storagePath))
    {
        fs::create_directories(storagePath);
        std::cout << "已自动创建存储目录: " << storagePath << std::endl;
    }

    RTMP_LogSetLevel(RTMP_LOGDEBUG);

    RTMP *rtmp = RTMP_Alloc();
    RTMP_Init(rtmp);

    // 超时
    rtmp->Link.timeout = 5;

    if (!RTMP_SetupURL(rtmp, (char *)url))
    {
        std::cerr << "设置url失败" << std::endl;
        RTMP_Free(rtmp);
        return -1;
    }

    if (!RTMP_Connect(rtmp, NULL) || !RTMP_ConnectStream(rtmp, 0))
    {
        std::cerr << "连接失败" << std::endl;
        RTMP_Free(rtmp);
        return -1;
    }

    std::ofstream currentFile;
    std::vector<char> flvHeader;
    int lastMinute = -1;

    char buffer[1024 * 64];
    int readSize = 0;

    std::cout << "开始循环录制，每分钟生成一个文件..." << std::endl;

    while ((readSize = RTMP_Read(rtmp, buffer, sizeof(buffer))) > 0)
    {
        std::time_t now = std::time(nullptr);
        int currentMinute = now / 60; // 以分钟为单位的时间戳
        // 捕获 Header（仅限程序启动后的第一次读取）
        if (flvHeader.empty())
        {
            flvHeader.assign(buffer, buffer + readSize);
        }
        // 检查是否需要切换文件（分钟变化）
        if (currentMinute != lastMinute)
        {
            if (currentFile.is_open())
            {
                currentFile.close();
            }

            std::string filename = get_current_filename(storagePath);
            currentFile.open(filename, std::ios::binary);

            // 写入 Header，保证每个一分钟的小文件都能独立播放
            if (!flvHeader.empty())
            {
                currentFile.write(flvHeader.data(), flvHeader.size());
            }

            std::cout << "创建新文件: " << filename << std::endl;
            lastMinute = currentMinute;
        }

        // 写入文件
        if (currentFile.is_open())
        {
            currentFile.write(buffer, readSize);
        }
    }

    if (currentFile.is_open())
    {
        currentFile.close();
    }
    RTMP_Close(rtmp);
    RTMP_Free(rtmp);

    return 0;
}