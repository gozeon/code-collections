using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spider.Utils
{
	internal class UrlDeduplicator
	{
		private readonly ConcurrentDictionary<string, byte> _visited = new();

		public bool TryMark(string url)
		{
			return _visited.TryAdd(Normalize(url), 0);
		}

		private string Normalize(string url)
		{
			return url.Trim().ToLowerInvariant();
		}
	}
}
