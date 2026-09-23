using System;
using System.Globalization;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

namespace MakeMp4.Core;

/// <summary>
/// 单张图片编成的视频片段缓存：下次再抽到同一张图、秒数也一样时，直接把上一次编好的
/// 片段拷出来用，省掉一次 ffmpeg 编码。片段按「图片文件名 + 秒数」命名，落在
/// &lt;输出目录&gt;/_cache 里，跨首复用。只认缓存文件在不在，不做时长/大小校验。
/// </summary>
public sealed class SegmentCache
{
    private readonly string _dir;
    private readonly JobLogger _log;
    private readonly string _suffix;
    private readonly bool _readOnly;

    public SegmentCache(string dir, AppConfig cfg, JobLogger log)
    {
        _dir = dir;
        _log = log;
        // 影响编码结果的配置打成一个短签名挂到文件名上：设置变了就不复用旧片段
        // （否则尺寸/帧率不同的片段拼在一起会直接对不上，concat 会拒绝）。
        _suffix = "_" + ShortHash(Signature(cfg));
        _readOnly = cfg.Force;   // 勾了「强制重建」时只写不读，逼一次真正的重编
    }

    public string Dir => _dir;

    /// <summary>本次运行命中缓存的片段数。</summary>
    public int Hits { get; private set; }

    /// <summary>该图片、该秒数对应的缓存片段路径；目录不存在时顺手建出来。</summary>
    public string PathFor(string image, double seconds)
    {
        var file = Path.GetFileName(image);
        var safe = Regex.Replace(file, @"[^\w.\-]+", "_");
        if (safe.Length == 0) safe = "image";
        var sec = seconds.ToString("0.###", CultureInfo.InvariantCulture);
        if (!Directory.Exists(_dir)) { try { Directory.CreateDirectory(_dir); } catch { } }
        return Path.Combine(_dir, $"{safe}_{sec}{_suffix}.mp4");
    }

    /// <summary>
    /// 缓存命中就拷一份到 dest 供本次拼接使用（拷而不是搬，缓存要留给下个视频）。
    /// 只判断文件存不存在，不校验内容；读失败就当没命中，交给调用方重编。
    /// </summary>
    public bool TryMaterialize(string image, double seconds, string dest)
    {
        if (_readOnly) return false;
        var cached = PathFor(image, seconds);
        if (!File.Exists(cached)) return false;
        try
        {
            File.Copy(cached, dest, overwrite: true);
            Hits++;
            _log.Write($"CACHE hit  {Path.GetFileName(image)} @ {seconds:0.###}s");
            return true;
        }
        catch (Exception ex)
        {
            _log.Warn($"  cache read failed, rebuilding: {Path.GetFileName(image)} ({ex.Message})");
            return false;
        }
    }

    /// <summary>把刚编好的片段存进缓存（copy，原片段留给本次拼接继续用）。</summary>
    public void Store(string image, double seconds, string clip)
    {
        if (!File.Exists(clip)) return;
        var cached = PathFor(image, seconds);
        try
        {
            if (File.Exists(cached)) return;   // 已经有了就不覆盖，避免并发/重复写
            File.Copy(clip, cached, overwrite: true);
            _log.Write($"CACHE put  {Path.GetFileName(image)} @ {seconds:0.###}s");
        }
        catch (Exception ex)
        {
            _log.Warn($"  cache write failed: {Path.GetFileName(image)} ({ex.Message})");
        }
    }

    /// <summary>影响单张图片片段编码结果的配置项；任何一项变了，旧片段都不该复用。</summary>
    private static string Signature(AppConfig cfg) => string.Join('|',
        cfg.Size ?? "-",
        cfg.Fps.ToString(CultureInfo.InvariantCulture),
        cfg.VCodec ?? "-",
        cfg.Crf.ToString(CultureInfo.InvariantCulture),
        cfg.Preset ?? "-",
        AppConfig.NormalizeFit(cfg.Fit),
        cfg.PadColor ?? "-",
        cfg.ImageSeconds.ToString("0.###", CultureInfo.InvariantCulture));

    private static string ShortHash(string text)
    {
        var hash = System.Security.Cryptography.MD5.HashData(Encoding.UTF8.GetBytes(text));
        return Convert.ToHexString(hash)[..8].ToLowerInvariant();
    }
}
