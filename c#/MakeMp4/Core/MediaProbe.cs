using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace MakeMp4.Core;

/// <summary>产物的时长 / 分辨率 / 体积，只用于日志核对与告警。</summary>
public sealed class VideoInfo
{
    public string? Width { get; set; }
    public string? Height { get; set; }
    public double? Duration { get; set; }
    public long? Size { get; set; }
}

/// <summary>ffprobe 探测：媒体时长 / 分辨率 / 从命令输出里取数字。</summary>
public static class MediaProbe
{
    private const string NumberPattern = @"[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?";
    private static readonly Regex WholeNumber = new("^" + NumberPattern + "$", RegexOptions.Compiled);
    private static readonly Regex AnyNumber = new("(" + NumberPattern + ")", RegexOptions.Compiled);

    /// <summary>从命令输出里取一个数字：优先「整行就是一个数」的行，否则取最后一个数字。</summary>
    public static double? NumFromOutput(string? output)
    {
        if (string.IsNullOrEmpty(output)) return null;
        double? fallback = null;
        foreach (var raw in output.Replace("\r\n", "\n").Split('\n'))
        {
            var line = raw.Trim();
            if (WholeNumber.IsMatch(line)
                && double.TryParse(line, NumberStyles.Float, CultureInfo.InvariantCulture, out var whole))
                return whole;
            var m = AnyNumber.Match(line);
            if (m.Success && double.TryParse(m.Groups[1].Value, NumberStyles.Float, CultureInfo.InvariantCulture, out var bit))
                fallback = bit;
        }
        return fallback;
    }

    /// <summary>读媒体时长（秒）。没有 ffprobe 就返回 null，只是少一个截断优化。</summary>
    public static async Task<double?> ProbeDurationAsync(
        ProcessRunner runner, string? ffprobe, string file, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(ffprobe) || string.IsNullOrEmpty(file)) return null;
        var output = await runner.CaptureAsync(new[]
        {
            ffprobe!, "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            file,
        }, ct).ConfigureAwait(false);
        var sec = NumFromOutput(output);
        return sec.HasValue && sec.Value > 0 ? sec : null;
    }

    public static async Task<VideoInfo> ProbeVideoInfoAsync(
        ProcessRunner runner, string? ffprobe, string file, CancellationToken ct)
    {
        var info = new VideoInfo();
        if (!string.IsNullOrEmpty(ffprobe) && !string.IsNullOrEmpty(file))
        {
            var output = await runner.CaptureAsync(new[]
            {
                ffprobe!, "-v", "error",
                "-select_streams", "v:0",
                "-show_entries", "format=duration,size:stream=width,height",
                "-of", "default=noprint_wrappers=1",
                file,
            }, ct).ConfigureAwait(false);

            foreach (var raw in output.Replace("\r\n", "\n").Split('\n'))
            {
                var m = Regex.Match(raw, "^([a-zA-Z_]+)=(\\S+)$");
                if (!m.Success) continue;
                var value = m.Groups[2].Value;
                switch (m.Groups[1].Value)
                {
                    case "width": info.Width = value; break;
                    case "height": info.Height = value; break;
                    case "duration" when double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var d):
                        info.Duration = d; break;
                    case "size" when long.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var s):
                        info.Size = s; break;
                }
            }
        }
        if (File.Exists(file))
        {
            try { info.Size = new FileInfo(file).Length; } catch { }
        }
        return info;
    }

    public static string FormatVideoInfo(VideoInfo v)
    {
        var bits = new List<string>();
        if (v.Width is not null && v.Height is not null) bits.Add($"{v.Width}x{v.Height}");

        var duration = v.Duration;
        var size = v.Size;
        if (duration is double dur) bits.Add(Keys.F(dur, 1) + "s");
        if (size is long bytes && duration is double secs && secs > 0)
            bits.Add($"{bytes} bytes (~{bytes * 8.0 / secs / 1000.0:0} kbps)");
        else if (size is long onlySize)
            bits.Add($"{onlySize} bytes");
        return bits.Count > 0 ? string.Join(' ', bits) : "(unknown)";
    }

    /// <summary>平均码率明显偏高时提醒一次：静态幻灯片本来几百 kbps 就够了。</summary>
    public static double? AverageKbps(VideoInfo v)
    {
        var size = v.Size;
        var duration = v.Duration;
        return size is long bytes && duration is double secs && secs > 0
            ? bytes * 8.0 / secs / 1000.0
            : null;
    }
}
