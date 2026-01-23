using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Channels;
using System.Threading.Tasks;
using Microsoft.Playwright;

namespace Spider.PlaywrightInfra
{
	internal class PagePool : IAsyncDisposable
	{
		private readonly Channel<IPage> _channel;

		public PagePool(IBrowserContext browserContext, int size)
		{
			_channel = Channel.CreateBounded<IPage>(size);
			_ = InitializeAsync(browserContext, size);
		}

		private async Task InitializeAsync(IBrowserContext browserContext, int size)
		{
			for (int i = 0; i < size; i++)
			{
				var page = await browserContext.NewPageAsync();
				// 强制浏览器进入全屏
				//await page.EvaluateAsync(@"document.documentElement.requestFullscreen()");
				await _channel.Writer.WriteAsync(page);
			}
		}

		public async ValueTask DisposeAsync()
		{
			_channel.Writer.Complete();

			while (_channel.Reader.TryRead(out var page))
			{
				await page.CloseAsync();
			}
		}

		internal async Task<IPage> RentAsync(CancellationToken ct) => await _channel.Reader.ReadAsync(ct);
		internal async Task ReturnAsync(IPage page) => await _channel.Writer.WriteAsync(page);

	}
}
