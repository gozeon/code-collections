#include <iostream>
#include <map>
#include <thread>
#include <csignal>
#include <atomic>
#include <vector>

// 全局标志位，仅用于通知主线程
std::atomic<bool> g_exit_requested(false);

void signal_handler(int sig)
{
    g_exit_requested = true;
}

void test_func(std::stop_token stoken, std::string url)
{
    while (!stoken.stop_requested())
    {
        std::cout << "运行: " << url << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(2));
    }
    std::cout << "结束运行" << url << std::endl;
}

int main()
{
    std::signal(SIGINT, signal_handler);
    std::signal(SIGTERM, signal_handler);

    // 使用 map 管理所有 jthread 录制任务
    std::map<std::string, std::jthread> task_map;

    // 假设从配置加载了 URL
    std::vector<std::string> urls = {"rtmp://...1", "rtmp://...2"};
    for (const auto &url : urls)
    {
        task_map.emplace(url, std::jthread(test_func, url));
    }

    std::cout << "程序运行中，按 Ctrl+C 退出..." << std::endl;

    // 主循环：等待退出信号
    while (!g_exit_requested)
    {
        std::this_thread::sleep_for(std::chrono::milliseconds(200));
    }

    // --- 核心操作：当 g_exit_requested 为 true 时 ---
    std::cout << "\n[系统] 正在清理并关闭所有任务..." << std::endl;

    /*
       关键：直接调用 clear()。
       1. 它会对 map 中每一个 jthread 调用析构函数。
       2. 每个 jthread 析构时会自动调用 request_stop()。
       3. 每个 jthread 析构时会自动调用 join()，等待该线程安全退出。
    */
    task_map.clear();

    std::cout << "[系统] 所有任务已安全停止，程序正常退出。" << std::endl;
    return 0;
}