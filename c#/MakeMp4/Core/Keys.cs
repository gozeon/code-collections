using System;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;

namespace MakeMp4.Core;

/// <summary>值清理与颜色工具。</summary>
public static class Keys
{
    /// <summary>
    /// 去掉从网页/聊天窗口复制路径时带进来的不可见字符（零宽空格、双向控制符、BOM 等）。
    /// 它们肉眼看不见，却足以让 ImageMagick 读不出字体、悄悄退回默认字体。
    /// </summary>
    public static string StripInvisible(string s) =>
        Regex.Replace(s, "[\u00AD\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF]", string.Empty);

    /// <summary>交给 ImageMagick 的路径一律写成正斜杠（反斜杠会被当成转义符吃掉）。</summary>
    public static string SlashPath(string p) => p.Replace('\\', '/');

    /// <summary>命令行参数回显：含空白时加引号。</summary>
    public static string QuoteArg(string? a)
    {
        if (a is null) return string.Empty;
        return Regex.IsMatch(a, @"\s") ? $"\"{a}\"" : a;
    }

    /// <summary>数值格式（固定小数点，InvariantCulture）。</summary>
    public static string F(double v, int digits) => v.ToString("F" + digits, CultureInfo.InvariantCulture);

    /// <summary>粗略判断颜色是否偏亮（#RGB / #RRGGBB / #RRGGBBAA 以及 white / black）。</summary>
    public static bool IsLightColor(string? c)
    {
        if (c is null) return false;
        var s = c.Trim().ToLowerInvariant();
        if (s == "white") return true;
        if (s == "black") return false;

        var m = Regex.Match(s, "^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$");
        if (!m.Success) return false;
        var hex = m.Groups[1].Value;
        if (hex.Length == 8) hex = hex[..6];
        if (hex.Length == 3)
            hex = string.Concat(hex.Select(ch => new string(ch, 2)));

        var r = Convert.ToInt32(hex[..2], 16);
        var g = Convert.ToInt32(hex.Substring(2, 2), 16);
        var b = Convert.ToInt32(hex.Substring(4, 2), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) > 150;
    }

    /// <summary>颜色归一化：white/black、#RGB、带 alpha 的 #RRGGBBAA 都换算成 #RRGGBB 比较。</summary>
    public static string CanonColor(string? c)
    {
        if (string.IsNullOrWhiteSpace(c)) return string.Empty;
        var s = Regex.Replace(c.ToLowerInvariant(), @"\s+", string.Empty).Trim('"', '\'').Trim();
        if (s == "white") return "#ffffff";
        if (s == "black") return "#000000";
        var m = Regex.Match(s, "^(#[0-9a-f]{6})[0-9a-f]{2}$");
        if (m.Success) s = m.Groups[1].Value;
        m = Regex.Match(s, "^#([0-9a-f]{3})$");
        if (m.Success)
            s = "#" + string.Concat(m.Groups[1].Value.Select(ch => new string(ch, 2)));
        return s;
    }
}
