# Spider

爬虫 ，利用playwright

# 线程池模型 

```
PlaywrightWorker (HostedService)
│
├─ Browser (1 个)
│
├─ Page Pool (N 个)
│     └─ Channel<IPage>
│
└─ Task Loop
      ├─ 从队列取任务
      ├─ 拿一个 Page
      ├─ 执行爬取
      └─ 归还 Page
```
