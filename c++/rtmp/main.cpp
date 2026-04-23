#include <iostream>
#include <fstream>
#include <vector>
#include <ctime>
#include <sstream>
#include <thread>
#include <iomanip>
#include <filesystem>
#include <atomic>
#include <csignal>

#include "lib/ada.h"

extern "C"
{
#include <librtmp/rtmp.h>
#include <librtmp/log.h>
}

namespace fs = std::filesystem;

// 全局运行标志
std::atomic<bool> keep_running(true);

// 信号处理
void signal_handler(int signal)
{
    if (signal == SIGINT)
    {
        std::cout << "\n[系统] 接收到退出信号，正在安全关闭所有任务..." << std::endl;
        keep_running = false;
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

// 获取当前时间的字符串文件名
std::string get_current_filename(const std::string &baseDir)
{
    std::time_t now = std::time(nullptr);
    std::tm *ltm = std::localtime(&now);
    std::ostringstream oss;
    oss << baseDir << "/" << std::put_time(ltm, "%Y%m%d%H%M%S") << ".flv";
    return oss.str();
}

// --- 核心录制工作函数 ---
void record_stream(std::string url)
{
    // 路径
    std::string storagePath = "records/" + parse_storage_path(url);
    if (!fs::exists(storagePath))
    {
        fs::create_directories(storagePath);
        std::cout << "已自动创建存储目录: " << storagePath << std::endl;
    }

    // 如果没有网络波动：程序会卡在内层 while 循环里疯狂干活（读取数据）。
    // 只要 RTMP_Read 能读到数据，它就永远不会跳出内层循环，也就永远不会再次执行外层的 connect 代码。
    while (keep_running)
    {
        RTMP_LogSetLevel(RTMP_LOGDEBUG);
        RTMP *rtmp = RTMP_Alloc();
        RTMP_Init(rtmp);

        // 设置读取超时（防止网络僵死时线程永久阻塞）
        rtmp->Link.timeout = 10;
        if (!RTMP_SetupURL(rtmp, (char *)url.c_str()) || !RTMP_Connect(rtmp, NULL) || !RTMP_ConnectStream(rtmp, 0))
        {
            std::cerr << "[重试] 无法连接: " << url << "，5秒后重试..." << std::endl;
            RTMP_Free(rtmp);

            // 在等待重连时也要检查退出标志
            for (int i = 0; i < 5 && keep_running; ++i)
            {
                std::this_thread::sleep_for(std::chrono::seconds(1));
            }
            continue;
        }
        std::ofstream currentFile;
        std::vector<char> flvHeader;
        int lastMinute = -1;

        char buffer[1024 * 64];
        int readSize = 0;
        while (keep_running)
        {
            readSize = RTMP_Read(rtmp, buffer, sizeof(buffer));
            if (readSize <= 0)
            {
                break;
            }
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

        if (!keep_running)
        {
            break;
        }
        std::this_thread::sleep_for(std::chrono::seconds(2)); // 断开后稍等再重连
    }

    std::cout << "[停止] 线程已退出: " << url << std::endl;
}

int main()
{
    // 注册信号
    std::signal(SIGINT, signal_handler);

    std::vector<std::thread> threads;
    std::ifstream conf("streams.txt");
    std::string line;

    if (!conf.is_open())
    {
        std::cerr << "找不到 streams.txt 配置文件" << std::endl;
        return -1;
    }

    // 读取配置，每个流启动一个线程
    while (std::getline(conf, line))
    {
        if (line.empty() || line[0] == '#')
            continue;
        threads.emplace_back(record_stream, line);
    }

    std::cout << "已启动 " << threads.size() << " 个录制任务..." << std::endl;

    for (auto &t : threads)
    {
        if (t.joinable())
        {
            t.join();
        }
    }

    std::cout << "[完成] 所有录制已停止，程序退出。" << std::endl;
    return 0;
}