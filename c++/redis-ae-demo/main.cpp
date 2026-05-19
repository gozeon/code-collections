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

static IdGenerator g_id_gen;
static char g_err_buf[ANET_ERR_LEN];

void readFromClient(struct aeEventLoop *el, int fd, void *privdata, int mask)
{
	char kBuffer[1024];
	bool has_data = false;
	bool connection_closed = false;

	// 1. 利用 while 循环一次性榨干当前 fd 的内核缓冲区
	while (true)
	{
		ssize_t nread = read(fd, kBuffer, sizeof(kBuffer));
		if (nread > 0)
		{
			has_data = true;
		}
		else if (nread == 0)
		{
			connection_closed = true;
			break;
		}
		else
		{
			if (errno == EAGAIN || errno == EWOULDBLOCK)
			{
				break; // 缓冲区干净了，退出 while
			}
			connection_closed = true;
			break;
		}
	}

	// 2. 核心隔离：利用运行时传入的参数 fd 响应，绝不串线！
	if (has_data && !connection_closed)
	{
		uint64_t new_id = g_id_gen.nextId();
		std::string res = std::to_string(new_id) + "\n";
		write(fd, res.data(), res.size());
	}

	// 3. 客户端下线：直接在此处干净地解除监听、关闭网络
	if (connection_closed)
	{
		spdlog::info("[断开] 客户端 fd: {} 已离线。", fd);
		aeDeleteFileEvent(el, fd, AE_READABLE);
		close(fd);
	}
}

void acceptClientHandler(struct aeEventLoop *el, int sfd, void *privdata, int mask)
{
	char ip[46] = {0};
	int port = 0;

	int client_fd = anetTcpAccept(g_err_buf, sfd, ip, sizeof(ip), &port);
	if (client_fd == ANET_ERR)
	{
		spdlog::error("Accept 失败: {}", g_err_buf);
		return;
	}

	anetNonBlock(g_err_buf, client_fd);

	spdlog::info("[连接] 客户端 [{}:{}] fd:{} 上线。", ip, port, client_fd);

	aeCreateFileEvent(el, client_fd, AE_READABLE, readFromClient, nullptr);
}

int main()
{
	std::signal(SIGINT, [](int)
				{
		spdlog::info("ctrl+c, 退出...");
		if(g_loop) {
			aeStop(g_loop);
		} });

	spdlog::info("启动发号器");

	int server_fd = anetTcpServer(g_err_buf, 9999, nullptr, 128);
	if (server_fd == ANET_ERR)
	{
		spdlog::error("绑定端口失败: {}", g_err_buf);
		return 1;
	}
	anetNonBlock(g_err_buf, server_fd);

	g_loop = aeCreateEventLoop(1024);
	if (!g_loop)
	{
		spdlog::error("无法创建eventloop");
		::close(server_fd);
		return -1;
	}
	spdlog::info("监听 9999 端口...");

	aeCreateFileEvent(g_loop, server_fd, AE_READABLE, acceptClientHandler, nullptr);

	// 阻塞循环
	aeMain(g_loop);

	spdlog::warn("释放资源");
	aeDeleteEventLoop(g_loop);
	::close(server_fd);
	return 0;
}