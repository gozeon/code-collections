using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace MakeMp4.Core;

/// <summary>封面配色，三个值都保证非空。</summary>
public sealed record Palette(string Bg, string Title, string Artist);

public enum CoverLayout
{
    /// <summary>歌曲名 / 作者各占一张 caption 图，再纵向拼接，字号不同（默认）。</summary>
    Lines,

    /// <summary>两行合成一张 caption 图的兜底排版。</summary>
    Single,
}

/// <summary>
/// ImageMagick 封面生成：渲染歌名 / 作者文字图，以及空画面检查（标准差）。
/// </summary>
public sealed class CoverMaker
{
    private readonly AppConfig _cfg;
    private readonly JobLogger _log;
    private readonly ProcessRunner _runner;
    private readonly string _magick;

    public CoverMaker(AppConfig cfg, JobLogger log, ProcessRunner runner, string magick)
    {
        _cfg = cfg;
        _log = log;
        _runner = runner;
        _magick = magick;
    }

    // ------------------------------------------------------------------
    // 配色
    // ------------------------------------------------------------------
    public Palette CoverPalette(string? bg, string? title, string? artist) => new(
        string.IsNullOrWhiteSpace(bg) ? AppConfig.DefaultCoverColor : bg!,
        string.IsNullOrWhiteSpace(title) ? AppConfig.DefaultTitleColor : title!,
        string.IsNullOrWhiteSpace(artist) ? AppConfig.DefaultArtistColor : artist!);

    /// <summary>当前配置的配色（无效值回落到默认色）。</summary>
    public Palette CurrentPalette() => CoverPalette(_cfg.CoverColor, _cfg.TitleColor, _cfg.ArtistColor);

    /// <summary>底色和文字色太接近（典型的「白底白字」）时需要换对比色。</summary>
    public static bool ColorNeedsContrast(Palette pal)
    {
        var bg = Keys.CanonColor(pal.Bg);
        if (bg.Length == 0) return true;
        if (Keys.CanonColor(pal.Title) == bg) return true;
        if (Keys.CanonColor(pal.Artist) == bg) return true;
        return false;
    }

    /// <summary>与底色对比明显的文字色，作为「白板封面」的最后兜底。</summary>
    public static Palette ContrastPalette(Palette pal)
    {
        var bg = string.IsNullOrWhiteSpace(pal.Bg) ? AppConfig.DefaultCoverColor : pal.Bg;
        return Keys.IsLightColor(bg)
            ? new Palette(bg, "#101418", "#38424e")
            : new Palette(bg, "white", "#c8d0d8");
    }

    /// <summary>封面文字字号：render_cover 与「两行是否都渲染出来」的校验共用。</summary>
    public (int Title, int Artist) CoverPointSizes(int vh)
    {
        var titlePt = _cfg.TitleSize ?? (int)(vh * 0.085);
        var artistPt = _cfg.ArtistSize ?? (int)(vh * 0.048);
        if (titlePt < 12) titlePt = 12;
        if (artistPt < 10) artistPt = 10;
        return (titlePt, artistPt);
    }

    // ------------------------------------------------------------------
    // 字体查找：优先用户指定，其次扫描系统字体目录里的中文字体
    // ------------------------------------------------------------------
    public List<string> FontCandidates()
    {
        var result = new List<string>();
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        void Add(IEnumerable<string> files)
        {
            foreach (var f in files)
                if (!string.IsNullOrWhiteSpace(f) && seen.Add(f)) result.Add(f);
        }

        if (!string.IsNullOrWhiteSpace(_cfg.Font)) Add(new[] { _cfg.Font! });

        var dirs = new List<string>();
        if (OperatingSystem.IsWindows()) dirs.AddRange(new[] { "C:/Windows/Fonts", "C:/WINNT/Fonts" });
        dirs.AddRange(new[] { "/usr/share/fonts", "/usr/local/share/fonts", "/Library/Fonts", "/System/Library/Fonts" });

        var all = new List<string>();
        foreach (var dir in dirs)
            if (Directory.Exists(dir)) all.AddRange(ListFontFiles(dir, 2));

        // 常见中文字体文件名（只按 ASCII 文件名匹配，避免编码问题）
        string[] prefer =
        {
            "msyh", "msjh", "simhei", "simsun", "simkai", "simfang", "deng", "stzhongs",
            "stsong", "stkaiti", "stfangsong", "yugoth", "msmincho", "meiryo", "malgun",
            "notosanscjk", "notoserifcjk", "sourcehan", "wqy", "pingfang", "hiragino",
            "stheiti", "arialuni", @"arial.?unicode", "uming", "ukai",
        };
        foreach (var prefix in prefer)
        {
            var re = new Regex("^" + prefix, RegexOptions.IgnoreCase);
            var hit = all.Where(f => re.IsMatch(Path.GetFileName(f))).ToList();
            if (hit.Count > 0) Add(hit);
        }
        Add(all);
        if (result.Count > 10) result.RemoveRange(10, result.Count - 10);   // 最多尝试 10 个
        return result;
    }

    private static IEnumerable<string> ListFontFiles(string dir, int depth)
    {
        var result = new List<string>();
        if (depth < 0 || !Directory.Exists(dir)) return result;
        string[] names;
        try { names = Directory.GetFileSystemEntries(dir); }
        catch { return result; }
        Array.Sort(names, StringComparer.Ordinal);
        foreach (var path in names)
        {
            var name = Path.GetFileName(path);
            if (name.StartsWith('.')) continue;
            if (Directory.Exists(path)) result.AddRange(ListFontFiles(path, depth - 1));
            else if (Regex.IsMatch(name, @"\.(?:tt[cf]|ot[cf])$", RegexOptions.IgnoreCase)) result.Add(path);
        }
        return result;
    }

    // ------------------------------------------------------------------
    // 空画面检查
    // ------------------------------------------------------------------
    private async Task<double?> ImageStddevAsync(string file, string[] extraArgs, CancellationToken ct)
    {
        foreach (var format in new[] { "%[fx:standard_deviation]", "%[standard-deviation]" })
        {
            var args = new List<string> { _magick };
            args.AddRange(extraArgs);
            args.AddRange(new[] { "-format", format, "info:" });
            var output = await _runner.CaptureAsync(args, ct).ConfigureAwait(false);
            var v = MediaProbe.NumFromOutput(output);
            if (v is not null && !double.IsNaN(v.Value) && !double.IsInfinity(v.Value) && v.Value < 1e30) return v;
        }
        return null;
    }

    public Task<double?> CoverStddevAsync(string file, CancellationToken ct) =>
        File.Exists(file) ? ImageStddevAsync(file, new[] { Keys.SlashPath(file) }, ct) : Task.FromResult<double?>(null);

    /// <summary>
    /// 一行文字图里是否真的画上了字：先合成到底色上变成不透明图再量标准差。
    /// 返回 true 有字 / false 没有字 / null 量不了。
    /// </summary>
    public async Task<bool?> LineHasContentAsync(string file, string? bg, CancellationToken ct)
    {
        if (!File.Exists(file)) return null;
        var background = string.IsNullOrWhiteSpace(bg) ? AppConfig.DefaultCoverColor : bg!;
        var sd = await ImageStddevAsync(file,
            new[] { Keys.SlashPath(file), "-background", background, "-alpha", "remove" }, ct).ConfigureAwait(false);
        return sd is null ? null : sd > AppConfig.CoverFlat;
    }

    /// <summary>读取图片像素高度（ImageMagick 的 %h）。</summary>
    public async Task<int?> ImageHeightAsync(string file, CancellationToken ct)
    {
        if (!File.Exists(file)) return null;
        var output = await _runner.CaptureAsync(
            new[] { _magick, Keys.SlashPath(file), "-format", "%h", "info:" }, ct).ConfigureAwait(false);
        var h = MediaProbe.NumFromOutput(output);
        return h is null ? null : (int)h.Value;
    }

    // ------------------------------------------------------------------
    // 封面渲染
    // ------------------------------------------------------------------

    /// <summary>
    /// 渲染一行文字到独立 PNG。返回 (ok, checked)：
    /// ok=0 没渲染出来（命令失败 / 没写出文件 / 字体读不出来）；
    /// ok=1, checked=0 写出图了但没法确认画面上有字；ok=1, checked=1 确认有字。
    /// </summary>
    private async Task<(bool Ok, bool Checked)> RenderLinePngAsync(
        string png, string textFile, string? font, string fill, int pt, int textW, string bg, CancellationToken ct)
    {
        if (!_cfg.DryRun && File.Exists(png)) File.Delete(png);

        var args = new List<string> { _magick, "-background", "none" };
        if (!string.IsNullOrWhiteSpace(font)) args.AddRange(new[] { "-font", Keys.SlashPath(font!) });
        args.AddRange(new[]
        {
            "-fill", fill,
            "-pointsize", pt.ToString(),
            "-size", textW + "x",
            "-gravity", "center",
            "-define", "caption:encoding=UTF-8",
            "caption:@" + Keys.SlashPath(textFile),
            "+repage",
            Keys.SlashPath(png),
        });

        var (ok, output) = await _runner.RunOutAsync(args, ct).ConfigureAwait(false);
        if (!ok) return (false, false);
        if (_cfg.DryRun) return (true, true);
        if (FontWarning(output, font)) return (false, false);

        if (!File.Exists(png) || new FileInfo(png).Length <= 0)
        {
            _log.Note("a text line produced no image (check the font)");
            return (false, false);
        }
        _log.FileEntry("line", png);

        var h = await ImageHeightAsync(png, ct).ConfigureAwait(false);
        if (h is not null && h <= 0)
        {
            _log.Note("a text line came out 0 pixel high (check the font)");
            return (false, false);
        }
        var has = await LineHasContentAsync(png, bg, ct).ConfigureAwait(false);
        if (has is false)
        {
            _log.Note("a text line rendered blank (missing glyphs, or text color = cover color)");
            return (true, false);
        }
        return (true, true);
    }

    /// <summary>
    /// 渲染封面：先按模式拼出文字图，再居中合成到底色上。
    /// 返回 (是否渲染成功, 文字图高度, 两行是否都确认画出来了)。
    /// </summary>
    private async Task<(bool Ok, double? StackHeight, bool LinesOk)> RenderCoverAsync(
        string cover, string work, string title, string artist, string? font,
        int vw, int vh, CoverLayout mode, Palette pal, CancellationToken ct)
    {
        var textW = (int)(vw * 0.86);
        var (titlePt, artistPt) = CoverPointSizes(vh);
        var stack = Path.Combine(work, "cover_text.png");

        var linesOk = true;
        double? stackH = null;

        if (mode == CoverLayout.Lines && artist.Length > 0)
        {
            var titleFile = Path.Combine(work, "title.txt");
            var artistFile = Path.Combine(work, "artist.txt");
            if (!WriteBytes(titleFile, title)) return (false, null, false);
            if (!WriteBytes(artistFile, artist)) return (false, null, false);

            var titlePng = Path.Combine(work, "title_line.png");
            var artistPng = Path.Combine(work, "artist_line.png");
            var (titleOk, titleChecked) = await RenderLinePngAsync(
                titlePng, titleFile, font, pal.Title, titlePt, textW, pal.Bg, ct).ConfigureAwait(false);
            var (artistOk, artistChecked) = await RenderLinePngAsync(
                artistPng, artistFile, font, pal.Artist, artistPt, textW, pal.Bg, ct).ConfigureAwait(false);

            // 歌名这一行都没画出来：这张封面没有意义，交给 make_cover 换字体 / 排版
            if (!titleOk) return (false, null, false);
            linesOk = artistOk && titleChecked && artistChecked;

            // 只拼真正渲染出来的行：作者行画不出来时，至少还留一张有歌名的封面
            var linePngs = new List<string>();
            if (titleOk) linePngs.Add(titlePng);
            if (artistOk) linePngs.Add(artistPng);
            if (!_cfg.DryRun) linePngs = linePngs.Where(File.Exists).ToList();

            var args = new List<string> { _magick, "-background", "none" };
            args.AddRange(linePngs.Select(Keys.SlashPath));
            args.AddRange(new[] { "-gravity", "center", "-append", "+repage", Keys.SlashPath(stack) });
            if (!await _runner.RunAsync(args, ct).ConfigureAwait(false)) return (false, null, false);
            if (!_cfg.DryRun)
            {
                var h = await ImageHeightAsync(stack, ct).ConfigureAwait(false);
                stackH = h;
            }
        }
        else
        {
            // 兜底排版：一张 caption 同时装两行，字号 / 颜色只有一组
            var text = artist.Length == 0 ? title : title + "\n" + artist;
            var textFile = Path.Combine(work, "cover_text.txt");
            if (!WriteBytes(textFile, text)) return (false, null, false);

            var args = new List<string> { _magick, "-background", "none" };
            if (!string.IsNullOrWhiteSpace(font)) args.AddRange(new[] { "-font", Keys.SlashPath(font!) });
            args.AddRange(new[]
            {
                "-fill", pal.Title,
                "-pointsize", titlePt.ToString(),
                "-size", textW + "x",
                "-gravity", "center",
                "-define", "caption:encoding=UTF-8",
                "caption:@" + Keys.SlashPath(textFile),
                "+repage",
                Keys.SlashPath(stack),
            });
            var (ok, output) = await _runner.RunOutAsync(args, ct).ConfigureAwait(false);
            if (!ok) return (false, null, false);
            if (FontWarning(output, font)) return (false, null, false);
            if (!_cfg.DryRun)
            {
                var h = await ImageHeightAsync(stack, ct).ConfigureAwait(false);
                stackH = h;
            }
            // 这张图里是不是两行都在，交给 make_cover 的高度检查判断
            linesOk = false;
        }

        // 第二步：文字图整体居中合成到底色上。底色显式写死，避免 xc: 拿到空颜色画白板。
        var composite = new List<string>
        {
            _magick,
            "-encoding", "UTF-8",
            "-background", pal.Bg,
            "-size", $"{vw}x{vh}",
            "xc:" + pal.Bg,
            "-gravity", "center",
            Keys.SlashPath(stack),
            "-composite",
            "-quality", "92",
            "-strip",
            Keys.SlashPath(cover),
        };
        if (!await _runner.RunAsync(composite, ct).ConfigureAwait(false)) return (false, null, false);
        return (true, stackH, linesOk);
    }

    /// <summary>
    /// 生成封面：依次尝试候选「字体 × 排版 × 配色」，校验不是空画面、两行都画出来了。
    /// 返回 (是否成功, 实际使用的字体)。
    /// </summary>
    public async Task<(bool Ok, string? Font)> MakeCoverAsync(
        string cover, string work, string title, string artist, int vw, int vh, CancellationToken ct)
    {
        var fonts = FontCandidates();
        if (fonts.Count == 0) fonts.Add(null!);   // 没找到字体时交给 ImageMagick 默认字体

        var pal = CurrentPalette();
        var stackPng = Path.Combine(work, "cover_text.png");

        // 候选组合：[字体, 排版模式, 配色]
        var tries = new List<(string? Font, CoverLayout Mode, Palette Pal)>();
        void AddTries(Palette p, int max)
        {
            var n = 0;
            foreach (var font in fonts)
            {
                var modes = artist.Length == 0
                    ? new[] { CoverLayout.Single }
                    : new[] { CoverLayout.Lines, CoverLayout.Single };
                foreach (var mode in modes)
                {
                    if (n >= max) break;
                    tries.Add((string.IsNullOrEmpty(font) ? null : font, mode, p));
                    n++;
                }
                if (n >= max) break;
            }
        }

        AddTries(pal, 10);
        if (ColorNeedsContrast(pal)) AddTries(ContrastPalette(pal), 6);
        // 最后手段：所有候选字体都读不出来时，不指定 -font 让 ImageMagick 用默认字体画一次
        tries.Add((null, artist.Length == 0 ? CoverLayout.Single : CoverLayout.Lines, pal));
        if (artist.Length > 0) tries.Add((null, CoverLayout.Single, pal));

        // 要求「歌曲名 / 作者各占一行」时，文字图至少要有两行那么高
        var needTwoLines = artist.Length > 0;
        var (titlePt, artistPt) = CoverPointSizes(vh);
        var minTextH = titlePt + artistPt;

        var canVerify = true;
        var canText = true;
        (string? Font, CoverLayout Mode, Palette Pal)? best = null;

        foreach (var t in tries)
        {
            var fontName = t.Font ?? "(ImageMagick default)";
            _log.Write($"COVER try font={fontName} mode={t.Mode.ToString().ToLowerInvariant()}");
            var (rok, stackH, linesOk) = await RenderCoverAsync(
                cover, work, title, artist, t.Font, vw, vh, t.Mode, t.Pal, ct).ConfigureAwait(false);
            if (!rok)
            {
                _log.Write($"COVER reject font={fontName} mode={t.Mode.ToString().ToLowerInvariant()}: not rendered");
                continue;
            }
            if (_cfg.DryRun)
            {
                _log.Write($"COVER accept (dry-run) font={fontName} mode={t.Mode.ToString().ToLowerInvariant()}");
                return (true, t.Font);
            }
            _log.FileEntry("cover", cover);
            // 每轮都覆盖同一个封面文件，记下最后渲染出来的结果，全不合格时拿它兜底
            best = t;

            // 用文字图（透明底）压到底色上量标准差，比量成品 jpg 可靠
            bool? textState = null;
            if (canText)
            {
                textState = await LineHasContentAsync(stackPng, t.Pal.Bg, ct).ConfigureAwait(false);
                if (textState is null) canText = false;
            }
            if (textState is false)
            {
                _log.Write($"COVER reject font={fontName} mode={t.Mode.ToString().ToLowerInvariant()}: no text drawn");
                continue;
            }

            var sd = canVerify ? await CoverStddevAsync(cover, ct).ConfigureAwait(false) : null;
            if (sd is null)
            {
                canVerify = false;    // 该 ImageMagick 不支持检测，直接采用
                _log.Write($"COVER accept font={fontName} (size not measurable)");
                return (true, t.Font);
            }
            if (sd <= AppConfig.CoverFlat)
            {
                _log.Write($"COVER reject font={fontName}: blank cover (sd={sd:0.0000})");
                continue;
            }
            if (linesOk)
            {
                _log.Write($"COVER accept font={fontName} mode={t.Mode.ToString().ToLowerInvariant()} (both lines verified)");
                return (true, t.Font);
            }
            if (needTwoLines && stackH is not null && stackH < minTextH)
            {
                _log.Write($"COVER reject font={fontName}: text height {stackH:0} < {minTextH}");
                continue;
            }
            _log.Write($"COVER accept font={fontName} mode={t.Mode.ToString().ToLowerInvariant()}");
            return (true, t.Font);
        }

        if (best is not null)
        {
            // 没有完全合格的候选：先把最后渲染出来的那张用上，但把问题说清楚
            var state = await LineHasContentAsync(stackPng, best.Value.Pal.Bg, ct).ConfigureAwait(false);
            if (state is false)
            {
                _log.Write("COVER accept best-effort: no text on the cover");
                _log.Warn($"  !! cover text was not drawn (font cannot draw these characters): {title}");
            }
            else if (needTwoLines)
            {
                _log.Write("COVER accept best-effort (artist line may be missing)");
                _log.Warn($"  !! cover may be missing the artist line: {title}");
            }
            else
            {
                _log.Write("COVER accept best-effort");
            }
            return (true, best.Value.Font);
        }

        _log.Write("COVER FAIL: no candidate rendered");
        return (false, null);
    }

    /// <summary>
    /// ImageMagick 读不出 -font 时只打一行警告、退出码仍是 0，然后悄悄退回默认字体
    /// （中文往往就画不出来）。这种情况要当成「这个字体不能用」。
    /// </summary>
    private bool FontWarning(string output, string? font)
    {
        if (string.IsNullOrEmpty(output) || !Regex.IsMatch(output, @"unable to read (?:the )?font", RegexOptions.IgnoreCase))
            return false;
        _log.Note("font unusable: " + (string.IsNullOrWhiteSpace(font) ? "(ImageMagick default)" : font));
        return true;
    }

    /// <summary>写文本文件（UTF-8 无 BOM，不经过命令行参数传递，避免 Windows 中文乱码）。</summary>
    private bool WriteBytes(string file, string text)
    {
        if (_cfg.DryRun)
        {
            var preview = text.Split('\n')[0];
            _log.Echo($"    [dry-run] write {file}: {preview}");
            return true;
        }
        try
        {
            File.WriteAllText(file, text, new UTF8Encoding(false));
            return true;
        }
        catch (Exception ex)
        {
            _log.Warn($"Cannot write: {file} ({ex.Message})");
            return false;
        }
    }
}
