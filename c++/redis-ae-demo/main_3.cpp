#include <iostream>
#include <memory>
#include <utility>
#include <system_error>
#include <unistd.h>
#include <fcntl.h>

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

	template <typename CallbackType>
	bool createFileEvent(int fd, int mask, CallbackType &&callback)
	{
		auto *heap_callback = new std::decay_t<CallbackType>(std::forward<CallbackType>(callback));

		// C 风格中转函数
		auto c_file_wrapper = [](struct aeEventLoop *eventLoop, int fd, void *clientData, int mask)
		{
			auto *func_ptr = static_cast<std::decay_t<CallbackType> *>(clientData);
			if (func_ptr)
			{
				(*func_ptr)(eventLoop, fd, mask);
			}
		};

		if (aeCreateFileEvent(loop, fd, mask, c_file_wrapper, heap_callback) == AE_ERR)
		{
			delete heap_callback;
			return false;
		}
		return true;
	}

	void deleteFileEvent(int fd, int mask)
	{
		aeDeleteFileEvent(loop, fd, mask);
	}

	// 启动循环
	void run()
	{
		aeMain(loop);
	}
	void stop()
	{
		aeStop(loop);
	}
};

// ==========================================
// 2. C++26 管道通信通道封装类
// ==========================================
class PipeChannel
{
private:
	int pipe_fds[2] = {-1, -1};

	// 设置文件描述符为非阻塞模式（libae 核心要求）
	void setNonBlocking(int fd)
	{
		int flags = fcntl(fd, F_GETFL, 0);
		if (flags == -1)
			throw std::system_error(errno, std::generic_category(), "fcntl F_GETFL 失败");
		if (fcntl(fd, F_SETFL, flags | O_NONBLOCK) == -1)
		{
			throw std::system_error(errno, std::generic_category(), "fcntl O_NONBLOCK 失败");
		}
	}

public:
	PipeChannel()
	{
		if (pipe(pipe_fds) == -1)
		{
			throw std::system_error(errno, std::generic_category(), "创建匿名管道失败");
		}
		// 将读端和写端全部设为异步非阻塞
		setNonBlocking(pipe_fds[0]);
		setNonBlocking(pipe_fds[1]);
	}

	~PipeChannel()
	{
		closeRead();
		closeWrite();
	}

	[[nodiscard]] int getReadFd() const noexcept { return pipe_fds[0]; }
	[[nodiscard]] int getWriteFd() const noexcept { return pipe_fds[1]; }

	void closeRead() noexcept
	{
		if (pipe_fds[0] != -1)
		{
			close(pipe_fds[0]);
			pipe_fds[0] = -1;
		}
	}

	void closeWrite() noexcept
	{
		if (pipe_fds[1] != -1)
		{
			close(pipe_fds[1]);
			pipe_fds[1] = -1;
		}
	}

	// C++26 风格高效写入（使用无拷贝的 string_view）
	void notify(std::string_view message)
	{
		if (pipe_fds[1] == -1)
			return;

		ssize_t nwritten = write(pipe_fds[1], message.data(), message.size());
		if (nwritten == -1 && errno != EAGAIN && errno != EWOULDBLOCK)
		{
			throw std::system_error(errno, std::generic_category(), "管道写入失败");
		}
	}

	// 从管道读取数据
	std::string readAll()
	{
		if (pipe_fds[0] == -1)
			return "";

		char buffer[1024];
		std::string result;

		while (true)
		{
			ssize_t nread = read(pipe_fds[0], buffer, sizeof(buffer));
			if (nread > 0)
			{
				result.append(buffer, nread);
			}
			else if (nread == 0)
			{
				break; // 对端关闭
			}
			else
			{
				if (errno == EAGAIN || errno == EWOULDBLOCK)
					break; // 数据读完了
				throw std::system_error(errno, std::generic_category(), "管道读取出错");
			}
		}
		return result;
	}
};

int main()
{
	spdlog::info("[Modern C++] 启动基于 Lambda 的 libae 封装测试...");
	try
	{
		auto channel = std::make_shared<PipeChannel>();

		pid_t pid = fork();
		if (pid < 0)
		{
			throw std::runtime_error("Fork 子进程失败");
		}
		if (pid == 0)
		{
			/* ================= 子进程 (生产者) ================= */
			channel->closeRead(); // 子进程不需要读
			spdlog::info("[子进程] 正在运行，准备发送通知...");
			for (int i = 1; i <= 3; ++i)
			{
				sleep(1);
				// 模拟写入事件/指令，C++26 运行时会通过管道泵入数据
				std::string msg = "COMMAND_ID_" + std::to_string(i) + "\n";
				channel->notify(msg);
			}
			channel->closeWrite();
			spdlog::info("[子进程] 数据发送完毕，安全退出。");
			return 0;
		}
		else
		{
			/* ================= 父进程 (消费者 + libae 驱动) ================= */
			channel->closeWrite(); // 父进程不需要写

			WrapperEventLoop event_loop(64);
			int receive_count = 0;

			// 核心高光：直接利用现代 Lambda 表达式监听管道可读事件
			// 完美捕获外部的 channel, event_loop 等上下文对象
			event_loop.createFileEvent(channel->getReadFd(), AE_READABLE,
									   [&receive_count, channel, &event_loop](aeEventLoop *loop, int fd, int mask) mutable
									   {
										   // 异步无阻塞读取所有数据
										   std::string raw_data = channel->readAll();
										   if (raw_data.empty())
										   {
											   spdlog::warn("[父进程] 检测到子进程已关闭写端，事件终止。");
											   event_loop.stop();
											   return;
										   }

										   receive_count++;
										   spdlog::info("[父进程 libae 触发] 收到通知数据: {}", raw_data);

										   if (receive_count >= 3)
										   {
											   spdlog::info("[父进程] 处理完所有预期任务，正在停止事件循环");
											   event_loop.stop();
										   }
									   });

			std::cout << "[父进程] 进入 libaeMain 主循环，等待异步管道信号...\n";
			event_loop.run();
		}
	}
	catch (const std::exception &e)
	{
		spdlog::error("异常: {}", e.what());
		return 1;
	}
	spdlog::info("退出程序");
	return 0;
}