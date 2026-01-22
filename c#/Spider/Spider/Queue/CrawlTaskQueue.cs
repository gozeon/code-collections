using Spider.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace Spider.Queue
{
	internal class CrawlTaskQueue
	{
		private readonly Channel<CrawlTask> _channel;

		public CrawlTaskQueue()
		{
			_channel = Channel.CreateUnbounded<CrawlTask>();
		}

		public ValueTask EnqueueAsync(CrawlTask task) => _channel.Writer.WriteAsync(task);
		public ValueTask<CrawlTask> DequeueAsync(CancellationToken ct) => _channel.Reader.ReadAsync(ct);
	}
}
