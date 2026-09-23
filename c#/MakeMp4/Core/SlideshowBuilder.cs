using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace MakeMp4.Core;

/// <summary>幻灯片的一项：图片或视频片段；dur 只有视频才需要探测，封面项用 cover_seconds。</summary>
public sealed class MediaItem
{
    public required string Path { get; init; }
    public string Type { get; init; } = "image";   // image | video
    public double? Dur { get; set; }
    public bool Cover { get; init; }
}

/// <summary>抽到的一项：一张图片（按 seconds / cover_seconds 编成一段视频）或一个视频片段（保留自身时长）。</summary>
public sealed class SlideChunk
{
    public string Type { get; init; } = "images";
    public bool Cover { get; init; }
    public List<string> Files { get; } = new();
    public double? Dur { get; set; }
}

/// <summary>
/// 幻灯片与成片合成：图片 / 视频片段切片、拼接，并循环铺满音频时长。
/// </summary>
public sealed class SlideshowBuilder
{
    private readonly AppConfig _cfg;
    private readonly JobLogger _log;
    private readonly ProcessRunner _runner;
    private readonly string _ffmpeg;
    private readonly List<string> _vencArgs = new();

    public SlideshowBuilder(AppConfig cfg, JobLogger log, ProcessRunner runner, string ffmpeg)
    {
        _cfg = cfg;
        _log = log;
        _runner = runner;
        _ffmpeg = ffmpeg;
        BuildEncoderArgs();
    }

    /// <summary>
    /// 幻灯片是「静态图切片」，这里的设置直接决定最终文件的大小：最后一步只是把这段
    /// 很短的视频流 copy 着循环铺满音频时长。关键点是每次换图必须落在关键帧上，
    /// 所以显式用 -force_key_frames 按每张图片的时长强制插 I 帧，再用 -g 兜一个最大间隔。
    /// </summary>
    private void BuildEncoderArgs()
    {
        if (Regex.IsMatch(_cfg.VCodec, "x26[45]"))
        {
            _vencArgs.AddRange(new[] { "-crf", _cfg.Crf.ToString(CultureInfo.InvariantCulture), "-preset", _cfg.Preset });
            var imgSec = _cfg.ImageSeconds;
            var gop = (int)(_cfg.Fps * imgSec);
            if (gop < 1) gop = 1;
            var gopMax = (int)(_cfg.Fps * 30);
            if (gopMax > 0 && gop > gopMax) gop = gopMax;
            _vencArgs.AddRange(new[] { "-g", gop.ToString(CultureInfo.InvariantCulture) });
            _vencArgs.AddRange(new[] { "-force_key_frames", $"expr:gte(t,n_forced*{imgSec.ToString("F3", CultureInfo.InvariantCulture)})" });
        }
        else
        {
            _vencArgs.AddRange(new[] { "-qscale:v", "3" });
        }
    }

    /// <summary>
    /// 缩放 / 补边滤镜链。三种「图片自适应」：
    /// contain（默认）等比缩进画框、四周补边；width 是宽度自适应，把高度铺满，
    /// 多出的宽度居中裁掉、不足的左右补边；height 是高度自适应，把宽度铺满，
    /// 多出的高度居中裁掉、不足的上下补边。
    /// crop 里的 min() 让画框在图比画框小时退化成不裁，交给后面的 pad 补满。
    /// </summary>
    public string VideoFilter(int vw, int vh)
    {
        var chain = AppConfig.NormalizeFit(_cfg.Fit) switch
        {
            "width" => new[]
            {
                $"scale=-2:{vh}:out_range=limited",
                $"crop=min(iw\\,{vw}):{vh}",
                $"pad={vw}:{vh}:(ow-iw)/2:(oh-ih)/2:color={_cfg.PadColor}",
            },
            "height" => new[]
            {
                $"scale={vw}:-2:out_range=limited",
                $"crop={vw}:min(ih\\,{vh})",
                $"pad={vw}:{vh}:(ow-iw)/2:(oh-ih)/2:color={_cfg.PadColor}",
            },
            _ => new[]
            {
                $"scale={vw}:{vh}:force_original_aspect_ratio=decrease:out_range=limited",
                $"pad={vw}:{vh}:(ow-iw)/2:(oh-ih)/2:color={_cfg.PadColor}",
            },
        };
        return string.Join(',', chain
            .Append($"fps={_cfg.Fps}")
            .Append("setsar=1")
            .Append("format=yuv420p"));
    }

    // ------------------------------------------------------------------
    // 列表文件
    // ------------------------------------------------------------------

    /// <summary>ffconcat 里统一写绝对路径（相对路径是相对列表文件所在目录解析的）。</summary>
    private static string ConcatPath(string path)
    {
        var s = Path.GetFullPath(path).Replace('\\', '/');
        return s.Replace("'", "'\\''");
    }

    public async Task<bool> WritePhotoListAsync(string file, IReadOnlyList<(string Path, double? Dur)> slides, CancellationToken ct)
    {
        var buf = new StringBuilder("ffconcat version 1.0\n");
        foreach (var (path, dur) in slides)
        {
            buf.Append("file '").Append(ConcatPath(path)).Append("'\n");
            if (dur is not null)
                buf.Append("duration ").Append(dur.Value.ToString("F3", CultureInfo.InvariantCulture)).Append('\n');
        }
        // 最后一张重复一次，避免 concat 忽略最后一项的 duration
        if (slides.Count > 0) buf.Append("file '").Append(ConcatPath(slides[^1].Path)).Append("'\n");
        return await WriteBytesAsync(file, buf.ToString(), ct).ConfigureAwait(false);
    }

    /// <summary>合并用的 ffconcat 列表：按顺序列出要拼的视频段。</summary>
    public async Task<bool> WriteConcatListAsync(string file, IReadOnlyList<string> parts, CancellationToken ct)
    {
        var real = parts.Where(p => !string.IsNullOrEmpty(p)).ToList();
        if (real.Count == 0) return false;
        var buf = new StringBuilder("ffconcat version 1.0\n");
        foreach (var part in real) buf.Append("file '").Append(ConcatPath(part)).Append("'\n");
        return await WriteBytesAsync(file, buf.ToString(), ct).ConfigureAwait(false);
    }

    private async Task<bool> WriteBytesAsync(string file, string text, CancellationToken ct)
    {
        if (_cfg.DryRun)
        {
            _log.Echo($"    [dry-run] write {file}: {text.Split('\n')[0]}");
            return true;
        }
        try
        {
            await File.WriteAllTextAsync(file, text, new UTF8Encoding(false), ct).ConfigureAwait(false);
            return true;
        }
        catch (Exception ex)
        {
            _log.Warn($"Cannot write: {file} ({ex.Message})");
            return false;
        }
    }

    // ------------------------------------------------------------------
    // 片段
    // ------------------------------------------------------------------

    /// <summary>一组连续图片（或单独一张片头封面）→ 一个视频片段。</summary>
    public async Task<bool> BuildImageClipAsync(
        string? photoList, string outFile, int vw, int vh, double? maxSec, string? cover, double? coverSec, CancellationToken ct)
    {
        var hasList = !string.IsNullOrEmpty(photoList);
        var hasCover = !string.IsNullOrEmpty(cover);
        if (!hasList && !hasCover) return false;   // 没有图片也没有封面可编码时直接失败

        var vf = VideoFilter(vw, vh);
        var args = new List<string>
        {
            // -nostdin：别让 ffmpeg 去读终端（Windows 下会把它自己挂住，看着就是「特别慢」）
            _ffmpeg, "-hide_banner", "-nostdin", "-y",
        };
        if (hasCover)
        {
            // -loop 1 -t 把封面读成正好 cover_sec 秒；缺了 -t 封面就只是一帧
            var sec = coverSec is > 0 ? coverSec.Value : 1;
            args.AddRange(new[] { "-loop", "1", "-t", sec.ToString("F3", CultureInfo.InvariantCulture), "-i", cover! });
            if (hasList)
            {
                args.AddRange(new[]
                {
                    "-f", "concat", "-safe", "0", "-i", photoList!,
                    "-filter_complex", $"[0:v]{vf}[cv];[1:v]{vf}[sv];[cv][sv]concat=n=2:v=1:a=0[out]",
                    "-map", "[out]",
                });
            }
            else
            {
                args.AddRange(new[] { "-vf", vf });
            }
        }
        else
        {
            args.AddRange(new[] { "-f", "concat", "-safe", "0", "-i", photoList!, "-vf", vf });
        }

        args.AddRange(new[] { "-an", "-c:v", _cfg.VCodec });
        args.AddRange(_vencArgs);
        args.AddRange(new[] { "-pix_fmt", "yuv420p", "-r", _cfg.Fps.ToString(CultureInfo.InvariantCulture) });
        // 音频比幻灯片短时只编码到音频结束，剩下的画面反正会被 -shortest 丢掉
        if (maxSec is > 0) args.AddRange(new[] { "-t", maxSec.Value.ToString("F3", CultureInfo.InvariantCulture) });
        args.Add(outFile);
        return await _runner.RunAsync(args, ct).ConfigureAwait(false);
    }

    /// <summary>视频片段 → 规范化成和图片片段完全相同的编码参数（才能 concat copy）。原声丢弃。</summary>
    public async Task<bool> BuildVideoClipAsync(string clip, string outFile, int vw, int vh, double? maxSec, CancellationToken ct)
    {
        var args = new List<string>
        {
            _ffmpeg, "-hide_banner", "-nostdin", "-y",
            "-i", clip,
            "-an",
            "-vf", VideoFilter(vw, vh),
            "-c:v", _cfg.VCodec,
        };
        args.AddRange(_vencArgs);
        args.AddRange(new[] { "-pix_fmt", "yuv420p", "-r", _cfg.Fps.ToString(CultureInfo.InvariantCulture) });
        if (maxSec is > 0) args.AddRange(new[] { "-t", maxSec.Value.ToString("F3", CultureInfo.InvariantCulture) });
        args.Add(outFile);
        return await _runner.RunAsync(args, ct).ConfigureAwait(false);
    }

    /// <summary>
    /// 单张图片 → 一段静音视频：随机抽取到的每张图都按自己设置好的秒数做成视频，
    /// 再和视频片段一起拼接。用 -loop 1 -t 把静图读成正好 seconds 秒（缺了 -t 就只出一帧），
    /// 编码参数和 BuildVideoClipAsync 完全一致，拼的时候才能直接 copy。
    /// </summary>
    public async Task<bool> BuildImageVideoAsync(string image, string outFile, int vw, int vh, double seconds, CancellationToken ct)
    {
        if (seconds <= 0) return false;
        var args = new List<string>
        {
            _ffmpeg, "-hide_banner", "-nostdin", "-y",
            "-loop", "1", "-t", seconds.ToString("F3", CultureInfo.InvariantCulture),
            "-i", image,
            "-an",
            "-vf", VideoFilter(vw, vh),
            "-c:v", _cfg.VCodec,
        };
        args.AddRange(_vencArgs);
        args.AddRange(new[] { "-pix_fmt", "yuv420p", "-r", _cfg.Fps.ToString(CultureInfo.InvariantCulture) });
        args.Add(outFile);
        return await _runner.RunAsync(args, ct).ConfigureAwait(false);
    }

    /// <summary>把若干片段按顺序拼成幻灯片视频：参数一致，直接 copy，不重新编码。</summary>
    public async Task<bool> ConcatSegmentsAsync(string listFile, string outFile, CancellationToken ct)
    {
        var args = new[]
        {
            _ffmpeg, "-hide_banner", "-nostdin", "-y",
            "-f", "concat", "-safe", "0", "-i", listFile,
            "-c", "copy",
            outFile,
        };
        return await _runner.RunAsync(args, ct).ConfigureAwait(false);
    }

    /// <summary>
    /// 兜底拼接：concat demuxer 要求各段编码参数完全一致，某段参数对不上时它会直接拒绝。
    /// 这时把每段当成独立输入，用 concat 滤镜重编一遍——慢一些，但一定能拼出来。
    /// </summary>
    public async Task<bool> ConcatSegmentsFilterAsync(string outFile, IReadOnlyList<string> segments, CancellationToken ct)
    {
        if (segments.Count == 0) return false;
        var args = new List<string> { _ffmpeg, "-hide_banner", "-nostdin", "-y" };
        var labels = new StringBuilder();
        for (var i = 0; i < segments.Count; i++)
        {
            args.AddRange(new[] { "-i", segments[i] });
            labels.Append('[').Append(i).Append(":v]");
        }
        args.AddRange(new[]
        {
            "-filter_complex", labels + $"concat=n={segments.Count}:v=1:a=0[out]",
            "-map", "[out]",
            "-an",
            "-c:v", _cfg.VCodec,
        });
        args.AddRange(_vencArgs);
        args.AddRange(new[] { "-pix_fmt", "yuv420p", "-r", _cfg.Fps.ToString(CultureInfo.InvariantCulture), outFile });
        return await _runner.RunAsync(args, ct).ConfigureAwait(false);
    }

    /// <summary>
    /// 把有序的媒体列表拆成片段：随机抽取到的每一项各占一段 —— 视频片段保留自身时长单独成段，
    /// 每张图片按 seconds 单独做成一段视频，片头封面用 cover_seconds 单独成段（好让它只播一次）。
    /// 每段带 dur（预计时长），用来算「需要多长画面」的预算。
    /// </summary>
    public static List<SlideChunk> SplitItems(IReadOnlyList<MediaItem> media, double seconds)
    {
        var chunks = new List<SlideChunk>();
        foreach (var m in media)
        {
            // 视频片段保留自身时长（探不到就留空，不占用编码预算）；图片/封面按自己的秒数
            var dur = m.Type == "video" ? m.Dur : (m.Dur ?? seconds);
            var chunk = new SlideChunk
            {
                Type = m.Type == "video" ? "video" : "images",
                Cover = m.Cover,
                Dur = dur,
            };
            chunk.Files.Add(m.Path);
            chunks.Add(chunk);
        }
        return chunks;
    }

    /// <summary>
    /// 收尾段：幻灯片要循环铺满音频时，循环次数取整后总剩一小段（rem 秒）。这段如果又从
    /// 第一张图开始播，成片的片头就会在片尾原样重复一遍。这里直接从幻灯片的**末尾**
    /// 裁 rem 秒（copy，不重新编码，段首落在关键帧上），让成片结束在最后几张画面上，
    /// 片头和片尾就不再是同一段。
    /// </summary>
    public async Task<string?> BuildTailFragmentAsync(
        string slides, double slidesDur, double coverSec, double tailSec, string outFile,
        int vw, int vh, CancellationToken ct)
    {
        if (tailSec <= 0 || slidesDur <= 0) return null;
        var start = slidesDur - tailSec;
        if (start <= coverSec + 0.01) return null;   // 别把只播一次的封面也裁进来

        var args = new List<string>
        {
            _ffmpeg, "-hide_banner", "-nostdin", "-y",
            // 这里必须重编码，不能 copy：copy 只能从 start 之前的关键帧开始，会把刚播过的
            // 那几张图又放一遍（看起来就是某张图显示时间变长了）。重编码时 -ss 放在 -i
            // 前面是精确的，段首也保证是 I 帧，体积小、还能和前面的段 copy 拼接。
            "-ss", start.ToString("F3", CultureInfo.InvariantCulture),
            "-i", slides,
            "-t", tailSec.ToString("F3", CultureInfo.InvariantCulture),
            "-an",
            "-vf", VideoFilter(vw, vh),
            "-c:v", _cfg.VCodec,
        };
        args.AddRange(_vencArgs);
        args.AddRange(new[] { "-pix_fmt", "yuv420p", "-r", _cfg.Fps.ToString(CultureInfo.InvariantCulture) });
        args.Add(outFile);
        return await _runner.RunAsync(args, ct).ConfigureAwait(false) ? outFile : null;
    }

    /// <summary>
    /// 收尾段（另一种做法）：把图片重新洗牌再编一小段。循环剩下的零头如果只是重复上面
    /// 那一整段（不管是从头还是从尾），成片里都会出现一段和别处一模一样的内容；重洗之后
    /// 片尾是新的顺序，既不会重复片头，也不会紧挨着回放幻灯片结尾。
    /// 图片不够铺满 tailSec 时就把洗好的列表再洗一遍接上，直到够长。
    /// avoidFirst 是收尾段前面那张已经显示过的图：洗牌后如果它又排在最前面，
    /// 会和前一段的结尾连成一张图显示两倍时长，所以必须挪开（同理，多轮洗牌之间
    /// 也要避免上一轮最后一张和下一轮第一张相同）。
    /// </summary>
    public async Task<string?> BuildReshuffledTailAsync(
        IReadOnlyList<string> images, string outFile, double tailSec, int vw, int vh, string listFile,
        string? avoidFirst, CancellationToken ct)
    {
        if (images.Count == 0 || tailSec <= 0) return null;
        var imgSec = _cfg.ImageSeconds;
        var pool = images.ToList();
        var entries = new List<(string Path, double? Dur)>();
        var acc = 0.0;
        string? previous = avoidFirst;   // 上一个已经出现在屏幕上的画面
        while (acc < tailSec + imgSec && entries.Count < 20000)   // 多留一张，-t 裁的时候有富余
        {
            MediaScanner.Shuffle(pool, Random.Shared);
            // 洗牌保证同一轮里没有相邻重复；这里只处理「紧接在上一个画面后面」的那张
            if (pool.Count > 1 && previous is not null && string.Equals(pool[0], previous, StringComparison.Ordinal))
                (pool[0], pool[1]) = (pool[1], pool[0]);
            foreach (var path in pool) { entries.Add((path, imgSec)); acc += imgSec; }
            previous = pool[^1];
        }
        if (!await WritePhotoListAsync(listFile, entries, ct).ConfigureAwait(false)) return null;
        return await BuildImageClipAsync(listFile, outFile, vw, vh, tailSec, null, null, ct).ConfigureAwait(false)
            ? outFile : null;
    }

    // ------------------------------------------------------------------
    // 第二步：循环正片并配上音频（视频流直接 copy，快且不损失画质）
    // ------------------------------------------------------------------

    /// <summary>
    /// 最后一步不重新编码画面：把正片 copy 着循环铺满音频时长，片头封面只排在最前面一份。
    /// 循环用「同一个文件在 ffconcat 列表里写 N 遍」的有限循环，再给输出加一个 -t 上限，
    /// 两头都封死：音频多长，成片就多长（避免个别 ffmpeg 版本 -shortest 收不住导致体积失控）。
    /// </summary>
    public async Task<bool> MakeVideoAsync(
        string slides, string? loopList, string audio, string outMp4, double? maxSec, CancellationToken ct)
    {
        var args = new List<string> { _ffmpeg, "-hide_banner", "-nostdin", "-y" };
        if (!string.IsNullOrEmpty(loopList))
            args.AddRange(new[] { "-f", "concat", "-safe", "0", "-i", loopList! });
        else
            args.AddRange(new[] { "-stream_loop", "-1", "-i", slides });

        args.AddRange(new[]
        {
            "-i", audio,
            "-map", "0:v:0",
            "-map", "1:a:0",
            "-c:v", "copy",
            "-c:a", _cfg.ACodec,
            "-b:a", _cfg.ABitrate,
            "-movflags", "+faststart",
        });
        if (maxSec is > 0) args.AddRange(new[] { "-t", maxSec.Value.ToString("F3", CultureInfo.InvariantCulture) });
        args.Add("-shortest");
        args.Add(outMp4);
        return await _runner.RunAsync(args, ct).ConfigureAwait(false);
    }
}
