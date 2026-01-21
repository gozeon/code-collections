# DemoWorker

```txt
Host (进程)
 ├─ Worker A（调度 / 监听）
 │    ├─ Job 1
 │    ├─ Job 2
 │    └─ Job 3
 │
 └─ Worker B（另一种触发方式）
      ├─ Job 2
      └─ Job 4
```

# 配置使用

假设：

DOTNET_ENVIRONMENT=Gray


加载顺序是：

1️⃣ appsettings.json
2️⃣ appsettings.Gray.json
3️⃣ 环境变量
4️⃣ 命令行参数

👉 和 Dev / Prod 完全一致

# 日志

三、LogLevel 是什么？（先把层级记住）

从低到高（越往下越严重）：

级别	含义
Trace	超细节，几乎不用
Debug	调试用
Information	正常业务日志
Warning	潜在问题
Error	错误
Critical	致命错误
None	禁用

📌 规则：

设置为 Information
👉 会输出 Information 及以上（Warning / Error / Critical）

{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting": "Information"
    }
  }
}
规则
Microsoft：控制 Microsoft.*

Microsoft.Hosting：更具体，优先级更高

# Service

Service 到底是什么？

从本质上说：

Service = 一个可复用、无状态或受控状态的“能力”

常见 Service 类型
Service	职责
Repository	数据访问
ApiClient	外部接口
DomainService	业务规则
CacheService	缓存
Clock	时间抽象
LockService	分布式锁


```
Host
 └─ Worker (Singleton)
      └─ Job (Scoped / Transient)
           └─ Service (Singleton / Scoped)
```

.NET DI 生命周期对照表  

| 生命周期          | 注册方式                | 实例数量         | 生命周期范围              | 是否线程安全  | 典型用途                      | Worker 项目注意点                |
| ------------- | ------------------- | ------------ | ------------------- | ------- | ------------------------- | --------------------------- |
| **Singleton** | `AddSingleton<T>()` | 全进程 1 个      | Host 启动 → 进程结束      | ❗必须自己保证 | 配置、缓存、纯计算、客户端             | Worker / Job 通常都是 Singleton |
| **Scoped**    | `AddScoped<T>()`    | 每个 Scope 1 个 | Scope 创建 → Scope 释放 | 不要求     | DbContext、Repository、业务服务 | ⚠️ Worker 中必须手动建 Scope      |
| **Transient** | `AddTransient<T>()` | 每次注入 1 个     | 用完即丢                | 不要求     | 轻量、无状态工具类                 | 高频调用可能产生 GC 压力              |

Worker 场景下的“真实对应关系”  

| 对象类型                         | 推荐生命周期             | 原因                    |
| ---------------------------- | ------------------ | --------------------- |
| Worker (`BackgroundService`) | Singleton          | Host 只创建一次            |
| Scheduler / Listener         | Singleton          | 运行时控制者                |
| Job                          | Scoped 或 Transient | 一次执行一个实例              |
| DbContext                    | Scoped             | 事务边界清晰                |
| Repository                   | Scoped             | 跟随 DbContext          |
| HttpClient                   | ❌ 不直接注册            | 用 `HttpClientFactory` |
| 业务 Service                   | Scoped             | 有状态 / 事务              |
| 工具类（Time、Hash）               | Singleton          | 无状态                   |
