#include <iostream>
#include <memory>
#include <utility>
#include <system_error>
#include <unistd.h>
#include <fcntl.h>
#include <csignal>

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
#include <anet.h>
}

static aeEventLoop *g_loop = nullptr;

void signalHandler(int signum)
{
	if (signum == SIGINT || signum == SIGTERM)
	{
		std::cout << "\n[系统信号] 捕获到退出请求 (Ctrl+C)，正在安全停止 libae 事件循环...\n";
		if (g_loop)
		{
			aeStop(g_loop); // 核心：通知 aeMain 优雅打破阻塞退出
		}
	}
}

// 发号器核心逻辑类
class IdGenerator
{
private:
	uint64_t last_timestamp = 0;
	uint32_t sequence = 0;

	// 获取当前毫秒级时间戳
	uint64_t getNowMs() const noexcept
	{
		auto now = std::chrono::steady_clock::now();
		return std::chrono::duration_cast<std::chrono::milliseconds>(now.time_since_epoch()).count();
	}

public:
	uint64_t nextId()
	{
		uint64_t current_timestamp = getNowMs();

		if (current_timestamp == last_timestamp)
		{
			// 同一毫秒内，计数器直接递增
			sequence = (sequence + 1) & 0x3FFFFF; // 22位掩码
			if (sequence == 0)
			{
				// 如果当前毫秒的序列号耗尽（基本不可能），阻塞等待下一毫秒
				while (current_timestamp <= last_timestamp)
				{
					current_timestamp = getNowMs();
				}
			}
		}
		else
		{
			// 新的一毫秒，计数器重置
			sequence = 0;
			last_timestamp = current_timestamp;
		}

		// 组合 ID：时间戳左移 22 位 | 序列号
		return (current_timestamp << 22) | sequence;
	}
};

int main()
{
	std::signal(SIGINT, [](int)
				{
		spdlog::info("ctrl+c, 退出...");
		if(g_loop) {
			aeStop(g_loop);
		} });

	spdlog::info("发号器");
	char err_buf[ANET_ERR_LEN];
	IdGenerator id_gen;

	int server_fd = anetTcpServer(err_buf, 9999, nullptr, 128);
	if (server_fd == ANET_ERR)
	{
		spdlog::error("绑定端口失败: {}", err_buf);
		return 1;
	}
	anetNonBlock(err_buf, server_fd);

	g_loop = aeCreateEventLoop(1024);
	if (!g_loop)
	{
		spdlog::error("无法创建eventloop");
		::close(server_fd);
		return -1;
	}
	spdlog::info("监听 9999 端口...");

	auto accept_logic = [&](aeEventLoop *loop, int sfd, int mask)
	{
		char ip[46] = {0};
		int port;
		int client_fd = anetTcpAccept(err_buf, sfd, ip, sizeof(ip), &port);
		if (client_fd == ANET_ERR)
			return;
		anetNonBlock(err_buf, client_fd);

		spdlog::info("[连接] client [{}:{}] fd:{}", ip, port, client_fd);

		auto read_logic = [&id_gen](aeEventLoop *c_loop, int c_fd, int c_mask, auto &&self_ptr) -> void
		{
			char dummy;
			//TODO: 每次就读一字节，读完了缓冲区还有，缓冲区只要有数据，就会触发回调
			ssize_t nread = read(c_fd, &dummy, 1);
			if (nread > 0)
			{
				uint64_t new_id = id_gen.nextId();
				std::string res = std::to_string(new_id) + "\n";
				write(c_fd, res.data(), res.size());
			}
			else
			{
				spdlog::info("断开连接 fd: {}", c_fd);
				aeDeleteFileEvent(c_loop, c_fd, AE_READABLE);
				close(c_fd);

				delete self_ptr;
			}
		};

		// 将第二层的 Lambda 部署到堆上，并借助 C 风格中转函数运行
		using ReadLambdaType = decltype(read_logic);
		auto *heap_read_logic = new ReadLambdaType(std::move(read_logic));

		auto c_read_bridge = [](struct aeEventLoop *el, int f, void *cd, int m)
		{
			auto *func = static_cast<ReadLambdaType *>(cd);
			if (func)
			{
				// 执行逻辑，并将它自身的指针（func）传进去，以便它内部在断开时能自杀（delete self_ptr）
				(*func)(el, f, m, func);
			}
		};

		aeCreateFileEvent(loop, client_fd, AE_READABLE, c_read_bridge, heap_read_logic);
	};

	// 部署第一层 Server 监听
	using AcceptLambdaType = decltype(accept_logic);
	auto *heap_accept_logic = new AcceptLambdaType(std::move(accept_logic));

	auto c_server_bridge = [](struct aeEventLoop *el, int f, void *cd, int m)
	{
		auto *func = static_cast<AcceptLambdaType *>(cd);
		if (func)
			(*func)(el, f, m);
	};

	aeCreateFileEvent(g_loop, server_fd, AE_READABLE, c_server_bridge, heap_accept_logic);

	// 阻塞循环
	aeMain(g_loop);

	spdlog::warn("释放资源");
	aeDeleteEventLoop(g_loop);
	::close(server_fd);
	delete heap_accept_logic;
	return 0;
}