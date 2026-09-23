using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace MakeMp4.Core;

/// <summary>
/// 外部程序查找：在配置的目录里定位命令（目录留空时退回 PATH），
/// 并用 -version 的输出确认身份。
/// </summary>
public static class ToolLocator
{
    /// <summary>ImageMagick 目录里可能的可执行文件名。</summary>
    public static readonly string[] MagickNames = { "magick", "magick.exe", "convert", "convert.exe" };

    /// <summary>ffmpeg 目录里可能的可执行文件名。</summary>
    public static readonly string[] FfmpegNames = { "ffmpeg", "ffmpeg.exe" };

    /// <summary>ffprobe 与 ffmpeg 同目录，文件名候选。</summary>
    public static readonly string[] FfprobeNames = { "ffprobe", "ffprobe.exe" };

    /// <summary>
    /// 展开候选命令：配置了目录就用「目录\命令名」，留空则退回 PATH 里的裸命令名。
    /// </summary>
    public static string[] Candidates(string? dir, string[] names)
    {
        if (string.IsNullOrWhiteSpace(dir)) return names;
        var list = new List<string>(names.Length);
        foreach (var name in names) list.Add(Path.Combine(dir!, name));
        return list.ToArray();
    }

    public static async Task<string?> FindAsync(
        string kind, string? dir, string[] names, ProcessRunner runner, AppConfig cfg, CancellationToken ct)
    {
        var toTry = Candidates(dir, names);

        // --dry-run 时不做实际探测，只按配置/默认名继续
        if (cfg.DryRun) return toTry[0];

        foreach (var exe in toTry)
        {
            if (string.IsNullOrWhiteSpace(exe)) continue;
            var version = await runner.CaptureAsync(new[] { exe, "-version" }, ct).ConfigureAwait(false);
            if (!version.Any(char.IsWhiteSpace))
            {
                // 收不到输出的极少数环境：配置目录里确实存在的可执行文件也认
                if ((exe.Contains('\\') || exe.Contains('/')) && File.Exists(exe)) return exe;
                continue;
            }

            var ok = kind switch
            {
                "magick" => Regex.IsMatch(version, "ImageMagick", RegexOptions.IgnoreCase),
                "ffmpeg" => Regex.IsMatch(version, "ffmpeg version", RegexOptions.IgnoreCase),
                "ffprobe" => Regex.IsMatch(version, "ffprobe version", RegexOptions.IgnoreCase),
                _ => true,
            };
            if (ok) return exe;
        }
        return null;
    }
}
