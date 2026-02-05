using Microsoft.Extensions.Configuration;
using Microsoft.Playwright;
using Serilog.Context;
using Spider.Models;
using Spider.PlaywrightInfra;
using Spider.Queue;
using Spider.Services;
using Spider.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spider.Workers
{
	internal class PlaywrightWorker : BackgroundService
	{
		private readonly ILogger<PlaywrightWorker> _logger;
		private readonly CrawlTaskQueue _queue;
		private readonly UrlDeduplicator _urlDeduplicatior;
		private readonly PageHandlerFactory _pageHandlerFactory;
		private readonly SnapshotService _snapshotService;
		private readonly IConfiguration _configuration;

		private IPlaywright? _playwright;
		private IBrowser? _browser;
		private IBrowserContext? _browserContext;
		private PagePool? _pagePool;


		public PlaywrightWorker(
			IConfiguration configuration,
			ILogger<PlaywrightWorker> logger,
			CrawlTaskQueue queue,
			UrlDeduplicator urlDeduplicator,
			PageHandlerFactory pageHandlerFactory,
			SnapshotService snapshotService)
		{
			_configuration = configuration;
			_logger = logger;
			_queue = queue;
			_urlDeduplicatior = urlDeduplicator;
			_pageHandlerFactory = pageHandlerFactory;
			_snapshotService = snapshotService;

		}

		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			_logger.LogInformation("PlaywrightWorker string {Pid}", Environment.ProcessId);

			// 测试任务
			//await _queue.EnqueueAsync(new CrawlTask() { Type = CrawlTaskType.Search, Url = "http://cn.bing.com/search?q=yahoo" });

			// 读 appsetting.json 或 tasks.json
			var tasks = _configuration.GetSection("Tasks").Get<List<CrawlTask>>();
			if (tasks != null)
			{
				foreach (var task in tasks)
				{
					await _queue.EnqueueAsync(task);
				}
			}

			_playwright = await Playwright.CreateAsync();
			_browser = await _playwright.Chromium.LaunchAsync(
				new BrowserTypeLaunchOptions
				{
					// true 无头，false 显示浏览器
					Headless = false,
					// 全屏
					Args = new List<string> { "--start-maximized" },
				});

			// 如果使用_browser 就是打开多个浏览器
			_browserContext = await _browser.NewContextAsync(new BrowserNewContextOptions { ViewportSize = ViewportSize.NoViewport });
			_logger.LogInformation("Browser  launched");

			// 页面pool 并发，数量设置为2
			_pagePool = new PagePool(_browserContext, 3);


			// 并发任务
			while (!stoppingToken.IsCancellationRequested)
			{
				_logger.LogInformation("Waiting for task...");
				var task = await _queue.DequeueAsync(stoppingToken);
				//var page = await _pagePool.RentAsync(stoppingToken);
				//_ = HandlePageAsync(task, page, stoppingToken);

				//// 控制任务节奏，暂停
				//await Task.Delay(1000, stoppingToken);

				await ProcessAsync(task, stoppingToken);
			}

			// 模拟一次
			//var page = await _browser.NewPageAsync();
			//await RunOnce(page);


			_logger.LogInformation("PlaywrightWorker finished");

		}

		private async Task ProcessAsync(CrawlTask task, CancellationToken stoppingToken)
		{
			using (LogContext.PushProperty("TaskId", task.TaskId))
			{
				var pageThread = await _pagePool!.RentAsync(stoppingToken);
				try
				{
					//switch (task.Type)
					//{
					//	case CrawlTaskType.Search:
					//		await HandleSearchAsync(page, task, stoppingToken);
					//		break;
					//	case CrawlTaskType.Detail:
					//		await HandleDetailAsync(page, task, stoppingToken);
					//		break;
					//}

					// 匹配模式
					var handler = _pageHandlerFactory.GetHandler(task);
					var currentPage = await handler.HandleAsync(pageThread, task, stoppingToken);

					// 保存截图
					await _snapshotService.SaveAsync(currentPage, task);

				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "Task failed: {Url}", task.Url);
				}
				finally
				{
					await _pagePool!.ReturnAsync(pageThread);
				}

			}
		}


		// 截图、保存html
		private async Task HandleDetailAsync(IPage page, CrawlTask task, CancellationToken stoppingToken)
		{
			try
			{
				_logger.LogInformation("Detail: {Url}", task.Url);

				await page.GotoAsync(task.Url, new PageGotoOptions { Timeout = 30_000 });

			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Page excution failed");
			}
			finally
			{
				if (_pagePool != null)
				{
					await _pagePool.ReturnAsync(page);
				}
			}
		}

		// 截图、保存html、派生任务，找到详情
		private async Task HandleSearchAsync(IPage page, CrawlTask task, CancellationToken stoppingToken)
		{
			try
			{
				_logger.LogInformation("Search: {Url}", task.Url);

				await page.GotoAsync(task.Url, new PageGotoOptions { Timeout = 30_000 });

				await _queue.EnqueueAsync(new CrawlTask() { Type = CrawlTaskType.Detail, Url = "baidu.com", Depth = task.Depth + 1 });
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Page excution failed");
			}
			finally
			{
				if (_pagePool != null)
				{
					await _pagePool.ReturnAsync(page);
				}
			}

		}

		private async Task HandlePageAsync(CrawlTask task, IPage page, CancellationToken stoppingToken)
		{
			try
			{
				_logger.LogInformation("Processing {Url}", task.Url);

				await page.GotoAsync(task.Url, new PageGotoOptions
				{
					Timeout = 30_000
				});

				var title = await page.TitleAsync();

				_logger.LogInformation("Page title {Title}", title);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Page excution failed");
			}
			finally
			{
				if (_pagePool != null)
				{
					await _pagePool.ReturnAsync(page);
				}
			}
		}

		private async Task RunOnce(IPage page)
		{
			using (LogContext.PushProperty("JobId", Guid.NewGuid().ToString("N")))
			{
				_logger.LogInformation("Navigate to baidu.com");

				await page.GotoAsync("http://baidu.com");

				var title = await page.TitleAsync();

				_logger.LogInformation("Page title: {Title}", title);
			}
		}

		public override async Task StopAsync(CancellationToken cancellationToken)
		{
			_logger.LogInformation("PlaywrightWorker stopping");

			if (_pagePool != null)
			{
				await _pagePool.DisposeAsync();
			}

			if (_browserContext != null)
			{
				await _browserContext.CloseAsync();
			}
			if (_browser != null)
			{
				await _browser.CloseAsync();
			}

			_playwright?.Dispose();

			await base.StopAsync(cancellationToken);
		}
	}
}
