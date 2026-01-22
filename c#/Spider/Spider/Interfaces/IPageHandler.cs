using Microsoft.Playwright;
using Spider.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spider.Interfaces
{
	internal interface IPageHandler
	{
		bool CanHandle(Uri uri, CrawlTaskType type);

		Task<IPage> HandleAsync(IPage page, CrawlTask task, CancellationToken ct);
	}
}
