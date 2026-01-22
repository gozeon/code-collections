using Spider.Interfaces;
using Spider.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spider.Services
{
	internal class PageHandlerFactory
	{
		private readonly IEnumerable<IPageHandler> _handlers;

		public PageHandlerFactory(IEnumerable<IPageHandler> handlers)
		{
			_handlers = handlers;
		}

		public IPageHandler GetHandler(CrawlTask task)
		{
			var uri = new Uri(task.Url);
			return _handlers.FirstOrDefault(h => h.CanHandle(uri, task.Type)) ?? throw new InvalidOperationException(
				$"No handler for {task.Type} {task.Url}");
		}
	}
}
