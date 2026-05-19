#include <iostream>

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
// C++ 定时器回调函数
int cppTimerCallback(struct aeEventLoop *eventLoop, long long id, void *clientData)
{
	static int count = 0;
	count++;
	spdlog::info("定时器触发 {} 次", count);

	if (count >= 3)
	{
		spdlog::warn("停止事件循环");

		aeStop(eventLoop);
		return AE_NOMORE; // 销毁该定时器
	}
	return 1000; // 1000 毫秒后再次触发
}
int main()
{

	spdlog::info("aisk/libae 例子");

	// 创建事件循环
	aeEventLoop *loop = aeCreateEventLoop(64);

	// 注册定时器
	aeCreateTimeEvent(loop, 1000, cppTimerCallback, nullptr, nullptr);

	// 启动主循环
	aeMain(loop);

	// 清理
	aeDeleteEventLoop(loop);
	spdlog::info("exit");
	return 0;
}