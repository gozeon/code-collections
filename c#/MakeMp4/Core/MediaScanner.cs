using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace MakeMp4.Core;

/// <summary>目录扫描与文件名解析。</summary>
public static class MediaScanner
{
    /// <summary>扫目录：跳过点文件、按文件名排序、只收扩展名匹配的普通文件。</summary>
    public static List<string> ScanDir(string dir, IReadOnlySet<string> extensions)
    {
        var result = new List<string>();
        var names = Directory.GetFiles(dir).Select(p => Path.GetFileName(p) ?? string.Empty).ToList();
        names.Sort(StringComparer.Ordinal);
        foreach (var name in names)
        {
            if (name.StartsWith('.')) continue;
            var dot = name.LastIndexOf('.');
            if (dot <= 0 || dot == name.Length - 1) continue;
            var ext = name[(dot + 1)..].ToLowerInvariant();
            if (!extensions.Contains(ext)) continue;
            result.Add(Path.Combine(dir, name));
        }
        return result;
    }

    /// <summary>去掉目录与扩展名，得到输出文件用的基名。</summary>
    public static string StripExt(string path) => Path.GetFileNameWithoutExtension(path);

    /// <summary>「歌曲名-作者」拆成两行，并把空白折成一个空格。</summary>
    public static (string Title, string Artist) SplitName(string name)
    {
        var parts = Regex.Split(name, @"\s*[-－—–]\s*", RegexOptions.None, TimeSpan.FromSeconds(1));
        var title = parts.Length > 0 ? parts[0] : string.Empty;
        var artist = parts.Length > 1 ? parts[1] : string.Empty;

        static string Squash(string s) => Regex.Replace(s, @"\s+", " ").Trim();
        title = Squash(title);
        artist = Squash(artist);
        if (title.Length == 0)
        {
            title = name;
            artist = string.Empty;
        }
        return (title, artist);
    }

    /// <summary>Fisher-Yates 洗牌，对应 shuffle_list。</summary>
    public static void Shuffle<T>(IList<T> list, Random rng)
    {
        for (var i = list.Count - 1; i > 0; i--)
        {
            var j = rng.Next(i + 1);
            (list[i], list[j]) = (list[j], list[i]);
        }
    }
}
