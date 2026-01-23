using Microsoft.Playwright;
using Spider.Interfaces;
using Spider.Models;
using Spider.Queue;
using Spider.Utils;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spider.Services
{
	internal class DoubanMovieSearchHandler : IPageHandler
	{
		private readonly ILogger<DoubanMovieSearchHandler> _logger;
		private readonly UrlDeduplicator _dedup;
		private readonly CrawlTaskQueue _queue;

		public DoubanMovieSearchHandler(ILogger<DoubanMovieSearchHandler> logger, UrlDeduplicator urlDeduplicator, CrawlTaskQueue queue)
		{
			_logger = logger;
			_dedup = urlDeduplicator;
			_queue = queue;
		}

		public bool CanHandle(Uri uri, CrawlTaskType type)
		{
			return type == CrawlTaskType.Search && uri.Host.Contains("movie.douban.com");
		}

		public async Task<IPage> HandleAsync(IPage page, CrawlTask task, CancellationToken ct)
		{
			_logger.LogInformation("豆瓣电影 search: {Url}", task.Url);

			await page.GotoAsync(task.Url, new PageGotoOptions { WaitUntil = WaitUntilState.Load, Timeout = 30_000 });

			var searchBox = page.Locator("#db-nav-movie #inp-query");

			// 等待出现
			await searchBox.WaitForAsync(new LocatorWaitForOptions { State = WaitForSelectorState.Visible, Timeout = 3_000 });

			if (!string.IsNullOrEmpty(task.Keyword))
			{
				// 模拟打字
				await searchBox.FillAsync(task.Keyword, new LocatorFillOptions { Timeout = 5_000 });

				// 回车,两下强行触发
				await searchBox.PressAsync("Enter");
				await page.WaitForTimeoutAsync(1_500);

				// 等待结果
				var firstLink = await page.WaitForSelectorAsync(".item-root a", new PageWaitForSelectorOptions { Timeout = 5_000 });
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
