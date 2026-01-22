using Microsoft.Extensions.Options;
using Microsoft.Playwright;
using Spider.Models;
using Spider.Workers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spider.Services
{
	internal class SnapshotService
	{
		private readonly string _baseDir;
		private readonly ILogger<SnapshotService> _logger;

		public SnapshotService(IOptions<SnapshotOptions> options, ILogger<SnapshotService> logger)
		{
			_logger = logger;
			_baseDir = Path.Combine(
				Environment.GetEnvironmentVariable("BASE_DIR") ?? AppContext.BaseDirectory,
				options.Value.BaseDir);
		}

		public async Task SaveAsync(IPage page, string host, string taskId)
		{
			var dir = Path.Combine(_baseDir, host, taskId);
			Directory.CreateDirectory(dir);


			// 截图
			var screenshotPath = Path.Combine(dir, "screenshot.png");
			await page.ScreenshotAsync(new() { Path = screenshotPath, FullPage = true });

			// 保存 HTML
			var htmlPath = Path.Combine(dir, "page.html");
			var content = await page.ContentAsync();
			await File.WriteAllTextAsync(htmlPath, content);
		}

		public async Task SaveAsync(IPage page, CrawlTask task)
		{

			var host = new Uri(task.Url).Host;
			var taskId = task.TaskId.ToString("N");
			var dir = Path.Combine(_baseDir, host, taskId);
			Directory.CreateDirectory(dir);

			_logger.LogInformation("save {Url} to {Folder}", task.Url, dir);

			// 截图
			var screenshotPath = Path.Combine(dir, "screenshot.png");
			await page.ScreenshotAsync(new() { Path = screenshotPath, FullPage = true });

			// 保存 HTML
			var htmlPath = Path.Combine(dir, "page.html");
			var content = await page.ContentAsync();
			await File.WriteAllTextAsync(htmlPath, content);
		}
	}
}
