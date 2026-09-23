using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace MakeMp4.Core;

/// <summary>
/// 配置项的默认值、ini 键名/别名与扩展名表。
/// </summary>
public sealed class AppConfig
{
    /// <summary>封面排版/渲染逻辑的版本号，改动封面生成方式时 +1（旧封面会自动重建）。</summary>
    public const int CoverFormat = 2;

    /// <summary>低于此标准差视为纯色空封面。</summary>
    public const double CoverFlat = 0.002;

    /// <summary>小于这个字节数的 mp4 视为半成品。</summary>
    public const long MinMp4Size = 1024;

    /// <summary>封面配色的兜底值：xc: 拿到空颜色会退回默认白色，整张封面就成了白板。</summary>
    public const string DefaultCoverColor = "#1B1F3B";
    public const string DefaultTitleColor = "#FFE14D";
    public const string DefaultArtistColor = "#4DE1FF";

    /// <summary>图片自适应方式的默认值：等比缩小、四周补边。</summary>
    public const string DefaultFit = "contain";

    /// <summary>x264 / x265 的 preset 候选（下拉框用；其它编码器的值仍可手填）。</summary>
    public static readonly string[] X264Presets =
    {
        "ultrafast", "superfast", "veryfast", "faster", "fast",
        "medium", "slow", "slower", "veryslow", "placebo",
    };

    /// <summary>「图片自适应」下拉框选项，Value 落到 ini 的 fit 键。</summary>
    public static readonly FitOption[] FitOptions =
    {
        new("contain", "等比缩放补边（默认）"),
        new("width", "宽度自适应"),
        new("height", "高度自适应"),
    };

    public static readonly string[] AudioExtensions =
    {
        "mp3", "m4a", "m4b", "aac", "flac", "wav", "wma", "ogg", "oga", "opus",
        "ape", "wv", "ac3", "dts", "mka", "mp2", "aif", "aiff",
    };

    public static readonly string[] ImageExtensions =
    {
        "jpg", "jpeg", "jpe", "png", "bmp", "gif", "tif", "tiff", "webp",
    };

    public static readonly string[] VideoExtensions =
    {
        "mp4", "m4v", "mov", "mkv", "webm", "avi", "wmv", "flv", "mpg", "mpeg",
        "m2ts", "ts", "3gp", "ogv",
    };

    public static readonly IReadOnlyDictionary<string, string> KeyAliases = new Dictionary<string, string>
    {
        ["audio_dir"] = "audio",
        ["audiodir"] = "audio",
        ["audio_directory"] = "audio",
        ["music"] = "audio",
        ["music_dir"] = "audio",
        ["image_dir"] = "images",
        ["imagedir"] = "images",
        ["image_directory"] = "images",
        ["picture_dir"] = "images",
        ["pic_dir"] = "images",
        ["pics"] = "images",
        ["pictures"] = "images",
        ["out_dir"] = "out",
        ["outdir"] = "out",
        ["output"] = "out",
        ["output_dir"] = "out",
        ["magick"] = "magick_dir",
        ["imagemagick"] = "magick_dir",
        ["imagemagick_dir"] = "magick_dir",
        ["ffmpeg"] = "ffmpeg_dir",
        ["fit"] = "fit",
        ["fit_mode"] = "fit",
        ["image_fit"] = "fit",
        ["image_adapt"] = "fit",
        ["adapt"] = "fit",
        ["resize"] = "fit",
    };

    public static readonly IReadOnlySet<string> BoolKeys = new HashSet<string>(StringComparer.Ordinal)
    {
        "force", "keep_temp", "keep_cover", "dry_run", "shuffle", "verify_cover",
    };

    public string? AudioDir { get; set; }
    public string? ImageDir { get; set; }
    public string? OutDir { get; set; }
    public string? Font { get; set; }
    public string Size { get; set; } = "1280x720";
    public int Fps { get; set; } = 25;
    public double Seconds { get; set; } = 5;
    public double CoverSeconds { get; set; } = 2;
    public string CoverColor { get; set; } = DefaultCoverColor;
    public string TitleColor { get; set; } = DefaultTitleColor;
    public string ArtistColor { get; set; } = DefaultArtistColor;
    public int? TitleSize { get; set; }
    public int? ArtistSize { get; set; }
    public bool Shuffle { get; set; } = true;
    public bool VerifyCover { get; set; } = true;
    public string VCodec { get; set; } = "libx264";
    public int Crf { get; set; } = 23;
    public string Preset { get; set; } = "ultrafast";
    public string ACodec { get; set; } = "aac";
    public string ABitrate { get; set; } = "192k";
    public string PadColor { get; set; } = "black";

    /// <summary>图片自适应：contain（默认，等比补边）/ width（宽度自适应、高度铺满）/ height（高度自适应、宽度铺满）。</summary>
    public string Fit { get; set; } = DefaultFit;
    public bool Force { get; set; }
    public bool KeepTemp { get; set; }
    public bool KeepCover { get; set; } = true;
    public bool DryRun { get; set; }
    public string? MagickDir { get; set; }
    public string? FfmpegDir { get; set; }

    /// <summary>每张图片显示秒数（至少 1 秒）。</summary>
    public double ImageSeconds => Seconds > 0 ? Seconds : 5;

    /// <summary>解析 size = WxH，失败返回 null。</summary>
    public (int Width, int Height)? ParseSize()
    {
        var m = Regex.Match(Size ?? string.Empty, @"^\s*(\d+)\s*[xX*]\s*(\d+)\s*$");
        if (!m.Success) return null;
        var w = int.Parse(m.Groups[1].Value, CultureInfo.InvariantCulture);
        var h = int.Parse(m.Groups[2].Value, CultureInfo.InvariantCulture);
        if (w % 2 != 0) w--;
        if (h % 2 != 0) h--;
        return (w, h);
    }

    /// <summary>片头封面秒数：非数字关掉封面，超过 30 秒收敛到 30。</summary>
    public double NormalizedCoverSeconds(out string? warning)
    {
        warning = null;
        var raw = CoverSeconds;
        if (double.IsNaN(raw) || raw < 0)
        {
            warning = $"cover_seconds = '{CoverSeconds}' is not a number, cover intro disabled";
            return 0;
        }
        if (raw > 30)
        {
            warning = $"cover_seconds = {raw:0.#} is too long, clamped to 30";
            return 30;
        }
        return raw;
    }

    /// <summary>自适应方式的中文说明（日志 / 提示用）。</summary>
    public static string FitLabel(string? fit)
    {
        var v = NormalizeFit(fit);
        foreach (var option in FitOptions)
            if (option.Value == v) return option.Label;
        return v;
    }

    /// <summary>把 ini / 界面里的自适应写法归一成 contain / width / height。</summary>
    public static string NormalizeFit(string? value) => (value ?? string.Empty).Trim().ToLowerInvariant() switch
    {
        "width" or "w" or "宽" or "宽度" or "宽度自适应" or "fill_width" or "width_first" => "width",
        "height" or "h" or "高" or "高度" or "高度自适应" or "fill_height" or "height_first" => "height",
        _ => DefaultFit,
    };

    /// <summary>
    /// ini 里的一条键值 → 配置。空值不覆盖默认配置；未知键忽略。
    /// 返回 true 表示配置里出现了不可见字符（调用方记一条 note）。
    /// </summary>
    public bool TryApplyIniValue(string key, string value, out bool cleaned)
    {
        cleaned = false;
        if (string.IsNullOrEmpty(value)) return false;

        var clean = Keys.StripInvisible(value);
        cleaned = !string.Equals(clean, value, StringComparison.Ordinal);
        value = clean;

        key = key.ToLowerInvariant();
        if (KeyAliases.TryGetValue(key, out var alias)) key = alias;

        if (BoolKeys.Contains(key))
        {
            var b = Regex.IsMatch(value, @"^(1|true|yes|on)$", RegexOptions.IgnoreCase);
            return SetBool(key, b);
        }

        var inv = CultureInfo.InvariantCulture;
        switch (key)
        {
            case "audio": AudioDir = value; return true;
            case "images": ImageDir = value; return true;
            case "out": OutDir = value; return true;
            case "font": Font = value; return true;
            case "size": Size = value; return true;
            case "fps" when int.TryParse(value, NumberStyles.Integer, inv, out var fps): Fps = fps; return true;
            case "seconds" when double.TryParse(value, NumberStyles.Float, inv, out var sec): Seconds = sec; return true;
            case "cover_seconds" when double.TryParse(value, NumberStyles.Float, inv, out var csec): CoverSeconds = csec; return true;
            case "cover_color": CoverColor = value; return true;
            case "title_color": TitleColor = value; return true;
            case "artist_color": ArtistColor = value; return true;
            case "title_size" when int.TryParse(value, NumberStyles.Integer, inv, out var ts): TitleSize = ts; return true;
            case "artist_size" when int.TryParse(value, NumberStyles.Integer, inv, out var asc): ArtistSize = asc; return true;
            case "vcodec": VCodec = value; return true;
            case "crf" when int.TryParse(value, NumberStyles.Integer, inv, out var crf): Crf = crf; return true;
            case "preset": Preset = value; return true;
            case "abitrate": ABitrate = value; return true;
            case "pad_color": PadColor = value; return true;
            case "fit": Fit = NormalizeFit(value); return true;
            case "magick_dir": MagickDir = value; return true;
            case "ffmpeg_dir": FfmpegDir = value; return true;
            default: return false;
        }
    }

    private bool SetBool(string key, bool value)
    {
        switch (key)
        {
            case "force": Force = value; return true;
            case "keep_temp": KeepTemp = value; return true;
            case "keep_cover": KeepCover = value; return true;
            case "dry_run": DryRun = value; return true;
            case "shuffle": Shuffle = value; return true;
            case "verify_cover": VerifyCover = value; return true;
            default: return false;
        }
    }

    /// <summary>读 ini（UTF-8），返回 (配置, 是否清理过不可见字符)。</summary>
    public static (AppConfig Config, bool Cleaned) FromIni(string path)
    {
        var cfg = new AppConfig();
        var cleanedAny = false;
        foreach (var (key, value) in ParseIni(path))
        {
            if (cfg.TryApplyIniValue(key, value, out var cleaned)) cleanedAny |= cleaned;
        }
        return (cfg, cleanedAny);
    }

    /// <summary>逐行解析 ini：'#' / ';' 注释、引号、行尾注释（颜色值里的 # 保留）。</summary>
    public static IEnumerable<(string Key, string Value)> ParseIni(string path)
    {
        foreach (var rawLine in File.ReadLines(path, Encoding.UTF8))
        {
            var line = rawLine.TrimStart('\uFEFF').TrimEnd('\r', '\n');
            if (Regex.IsMatch(line, @"^\s*[#;]")) continue;

            var m = Regex.Match(line, @"^\s*([\w.\-]+)\s*[=:]\s*(.*?)\s*$");
            if (!m.Success) continue;

            var key = m.Groups[1].Value;
            var value = m.Groups[2].Value;

            var quoted = false;
            var q = Regex.Match(value, "^\"(.*)\"$", RegexOptions.Singleline);
            if (!q.Success) q = Regex.Match(value, "^'(.*)'$", RegexOptions.Singleline);
            if (q.Success)
            {
                value = q.Groups[1].Value;
                quoted = true;
            }

            // 去掉行尾注释；值是颜色时保留 '#'，否则颜色会被吃掉变成空值
            if (!quoted && !IsColorValue(value))
                value = Regex.Replace(value, @"\s+[#;].*$", string.Empty);

            value = value.Trim();
            if (value.Length == 0) continue;
            yield return (key, value);
        }
    }

    /// <summary>值是否形如颜色（#RGB / #RRGGBB / #RRGGBBAA）——用来区分颜色里的 '#' 和注释。</summary>
    public static bool IsColorValue(string? v)
    {
        if (v is null) return false;
        var s = v.Trim();
        var m = Regex.Match(s, "^[\"'](.*)[\"']$", RegexOptions.Singleline);
        if (m.Success) s = m.Groups[1].Value.Trim();
        return Regex.IsMatch(s, "^#[0-9A-Fa-f]{3,8}$");
    }

    /// <summary>图片自适应下拉框的一项（属性可绑定）。</summary>
    public sealed record FitOption(string Value, string Label);

    /// <summary>查找默认的 make_mp4.ini：程序目录 / 当前目录。</summary>
    public static string? FindDefaultIni()
    {
        foreach (var dir in new[] { AppContext.BaseDirectory, Directory.GetCurrentDirectory() })
        {
            var candidate = System.IO.Path.Combine(dir, "make_mp4.ini");
            if (File.Exists(candidate)) return candidate;
        }
        return null;
    }
}
