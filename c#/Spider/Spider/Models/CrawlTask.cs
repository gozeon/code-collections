using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spider.Models
{
	//internal class CrawlTask(CrawlTaskType Type,string Url,int Depth=0);

	internal sealed class CrawlTask
	{
		public CrawlTaskType Type { get; init; }
		public string Url { get; init; } = default!;
		public string? Keyword { get; init; }
		public int Depth { get; set; }
		public Guid TaskId { get; } = Guid.NewGuid();
	}
}
