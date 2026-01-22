using Microsoft.Playwright;
using Spider.Interfaces;
using Spider.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spider.Services
{
	internal class DefaultHandler : IPageHandler
	{
		private readonly ILogger<DefaultHandler> _logger;
		public DefaultHandler(ILogger<DefaultHandler> logger)
		{
			_logger = logger;
		}
		public bool CanHandle(Uri uri, CrawlTaskType type)
		{
			return type == CrawlTaskType.Detail;
		}

		public async Task<IPage> HandleAsync(IPage page, CrawlTask task, CancellationToken ct)
		{
			_logger.LogInformation("Detail page: {Url}", task.Url);

			await page.GotoAsync(task.Url, new PageGotoOptions { WaitUntil = WaitUntilState.DOMContentLoaded });
			var title = await page.TitleAsync();

			_logger.LogInformation("Title: {Title}", title);

			return page;
		}
	}
}
