using Microsoft.Playwright;
using Spider.Interfaces;
using Spider.Models;
using Spider.Queue;
using Spider.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spider.Services
{
	internal class BingSearchHandler : IPageHandler
	{
		private readonly CrawlTaskQueue _queue;
		private readonly UrlDeduplicator _dedup;
		private readonly ILogger<BingSearchHandler> _logger;


		public BingSearchHandler(CrawlTaskQueue queue, UrlDeduplicator urlDeduplicator, ILogger<BingSearchHandler> logger)
		{
			_queue = queue;
			_dedup = urlDeduplicator;
			_logger = logger;
		}
		public bool CanHandle(Uri uri, CrawlTaskType type)
		{
			return type == CrawlTaskType.Search && uri.Host.Contains("bing.com");
		}

		public async Task<IPage> HandleAsync(IPage page, CrawlTask task, CancellationToken ct)
		{
			_logger.LogInformation("Bing search: {Url}", task.Url);

			await page.GotoAsync(task.Url, new PageGotoOptions { WaitUntil = WaitUntilState.Load, Timeout = 30_000 });

			var searchBox = page.Locator("#sb_form_q");

			// 等待出现
			await searchBox.WaitForAsync(new LocatorWaitForOptions { State = WaitForSelectorState.Visible, Timeout = 3_000 });

			if (!string.IsNullOrEmpty(task.Keyword))
			{
				// 模拟打字
				await searchBox.FillAsync(task.Keyword, new LocatorFillOptions { Timeout = 5_000 });

				// 回车,两下强行触发
				await searchBox.PressAsync("Enter");
				await searchBox.PressAsync("Enter");

				// 等待结果
				var firstLink = await page.WaitForSelectorAsync("#b_results > li.b_algo h2 a", new PageWaitForSelectorOptions { Timeout = 5_000 });
				if (firstLink != null)
				{
					var href = await firstLink.GetAttributeAsync("href");
					if (!string.IsNullOrWhiteSpace(href) && _dedup.TryMark(href))
					{
						await _queue.EnqueueAsync(new CrawlTask() { Type = CrawlTaskType.Detail, Url = href, Depth = task.Depth + 1 });
					}
				}
				else
				{
					_logger.LogWarning("No search result link for {Url}", task.Url);
				}
			}

			return page;

		}
	}
}
