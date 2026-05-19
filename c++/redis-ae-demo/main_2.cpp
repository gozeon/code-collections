#include <iostream>
#include <memory>
#include <utility>

#include "spdlog/spdlog.h"

// Fix Redis/libae macro redefinition warnings
#ifdef _GNU_SOURCE
#undef _GNU_SOURCE
#endif
#ifdef _DEFAULT_SOURCE
#undef _DEFAULT_SOURCE
#endif
#ifdef _LARGEFILE_SOURCE
#undef _LARGEFILE_SOURCE
#endif

extern "C"
{
#include <ae.h>
}

class WrapperEventLoop
{
private:
	aeEventLoop *loop;

public:
	WrapperEventLoop(int setsize = 1024)
	{
		loop = aeCreateEventLoop(setsize);
		if (!loop)
			throw std::runtime_error("创建 aeEventLoop 失败");
	}

	~WrapperEventLoop()
	{
		if (loop)
			aeDeleteEventLoop(loop);
	}
	// 核心设计：利用模板完美适配所有 C++26 Lambda 表达式
	template <typename CallbackType>
	long long createTimer(long long milliseconds, CallbackType &&callback)
	{
		// 在堆上动态分配具体的 Lambda 类型
		auto *heap_callback = new std::decay_t<CallbackType>(std::forward<CallbackType>(callback));

		// 显式实例化内部的中转 C 函数指针
		auto c_wrapper = [](struct aeEventLoop *eventLoop, long long id, void *clientData) -> int
		{
			auto *func_ptr = static_cast<std::decay_t<CallbackType> *>(clientData);
			if (func_ptr)
			{
				int next_interval = (*func_ptr)(eventLoop, id);
				if (next_interval == AE_NOMORE)
				{
					delete func_ptr; // 运行完自动销毁
				}
				return next_interval;
			}
			return AE_NOMORE;
		};

		// 显式实例化销毁清理钩子
		auto c_finalizer = [](struct aeEventLoop *eventLoop, void *clientData)
		{
			auto *func_ptr = static_cast<std::decay_t<CallbackType> *>(clientData);
			delete func_ptr;
		};

		long long id = aeCreateTimeEvent(loop, milliseconds, c_wrapper, heap_callback, c_finalizer);
		if (id == AE_ERR)
		{
			delete heap_callback;
			return AE_ERR;
		}
		return id;
	}

	// 启动循环
	void run()
	{
		aeMain(loop);
	}
};

int main()
{
	spdlog::info("[Modern C++] 启动基于 Lambda 的 libae 封装测试...");
	try
	{
		WrapperEventLoop event_loop(128);

		// 局部变量：用来测试 Lambda 的“闭包捕获”能力
		int trigger_count = 0;
		std::string prefix = "[Lambda 定时器]";

		// 完美支持任何复杂的闭包捕获
		event_loop.createTimer(1000, [&trigger_count, prefix](aeEventLoop *loop, long long id) -> int
							   {
            trigger_count++;
            std::cout << prefix << " 触发成功! 计数: " << trigger_count << std::endl;
            
            if (trigger_count >= 3) {
                std::cout << prefix << " 满 3 次，触发 aeStop。" << std::endl;
                aeStop(loop);
                return AE_NOMORE;
            }
            return 1000; });

		event_loop.run();
	}
	catch (const std::exception &e)
	{
		spdlog::error("异常: {}", e.what());
		return 1;
	}
	spdlog::info("退出程序");
	return 0;
}