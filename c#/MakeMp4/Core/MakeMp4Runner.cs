using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MakeMp4.Core;

public sealed class RunSummary
{
    public int Ok { get; internal set; }
    public int Skipped { get; internal set; }
    public int Failed { get; internal set; }
    public int Total { get; internal set; }
    public int NoCover { get; internal set; }
}

/// <summary>
/// 主流程：读配置 → 在配置的目录里找外部程序 → 逐首音频
/// 生成封面、把图片/视频片段做成幻灯片、循环铺满音频时长后输出 mp4。
/// </summary>
public sealed class MakeMp4Runner
{
    private readonly AppConfig _cfg;
    private readonly JobLogger _log;
    private readonly ProcessRunner _runner;
    private readonly string? _configPath;
    private readonly Action<int, int>? _progress;

    private readonly HashSet<string> _imageExt = new(AppConfig.ImageExtensions, StringComparer.OrdinalIgnoreCase);
    private readonly HashSet<string> _videoExt = new(AppConfig.VideoExtensions, StringComparer.OrdinalIgnoreCase);
    private readonly HashSet<string> _audioExt = new(AppConfig.AudioExtensions, StringComparer.OrdinalIgnoreCase);

    private CoverMaker _covers = null!;
    private SlideshowBuilder _slides = null!;
    private SegmentCache _cache = null!;
    private string _ffprobe = string.Empty;
    private bool _warnedBitrate;

    public MakeMp4Runner(AppConfig cfg, JobLogger log, string? configPath = null, Action<int, int>? progress = null)
    {
        _cfg = cfg;
        _log = log;
        _runner = new ProcessRunner(cfg, log);
        _configPath = configPath;
        _progress = progress;
    }

    public async Task<RunSummary> RunAsync(CancellationToken ct)
    {
        var summary = new RunSummary();

        // 1) 音频目录 / 图片目录
        if (string.IsNullOrWhiteSpace(_cfg.AudioDir)) throw new InvalidOperationException("audio directory is required");
        if (string.IsNullOrWhiteSpace(_cfg.ImageDir)) throw new InvalidOperationException("image directory is required");

        var audioDir = Path.GetFullPath(_cfg.AudioDir!);
        var imageDir = Path.GetFullPath(_cfg.ImageDir!);
        if (!Directory.Exists(audioDir)) throw new DirectoryNotFoundException($"audio directory not found: {audioDir}");
        if (!Directory.Exists(imageDir)) throw new DirectoryNotFoundException($"image directory not found: {imageDir}");

        var outDir = string.IsNullOrWhiteSpace(_cfg.OutDir) ? Path.Combine(audioDir, "out") : Path.GetFullPath(_cfg.OutDir!);
        var coverDir = Path.Combine(outDir, "covers");
        var workDir = Path.Combine(outDir, "_work");
        var cacheDir = Path.Combine(outDir, "_cache");

        // 2) 视频尺寸
        var size = _cfg.ParseSize() ?? throw new InvalidOperationException($"invalid size '{_cfg.Size}', expected e.g. 1280x720");
        var (vw, vh) = size;

        // 3) 片头封面时长
        var coverSec = _cfg.NormalizedCoverSeconds(out var coverWarn);
        if (coverWarn is not null) _log.Warn(coverWarn);

        // 4) 日志：从这一刻起，每条命令、每个产出文件、每次封面取舍都记进去
        EnsureDir(outDir);
        EnsureDir(coverDir);
        EnsureDir(workDir);
        EnsureDir(cacheDir);
        _log.Open(Path.Combine(outDir, "make_mp4.log"));
        _log.Write("config    : " + (_configPath ?? "(none)"));
        _log.Write($"audio dir : {audioDir}");

        // 5) 查找外部程序：在配置的目录里找命令，目录留空时退回 PATH
        var magick = await ToolLocator.FindAsync("magick", _cfg.MagickDir,
            ToolLocator.MagickNames, _runner, _cfg, ct).ConfigureAwait(false);
        var ffmpeg = await ToolLocator.FindAsync("ffmpeg", _cfg.FfmpegDir,
            ToolLocator.FfmpegNames, _runner, _cfg, ct).ConfigureAwait(false);
        if (magick is null) throw new InvalidOperationException("ImageMagick not found. Set the ImageMagick directory in the config.");
        if (ffmpeg is null) throw new InvalidOperationException("ffmpeg not found. Set the ffmpeg directory in the config.");

        // ffprobe 与 ffmpeg 同目录：优先用配置的 ffmpeg 目录，否则用实际找到的 ffmpeg 所在目录
        var ffprobeDir = _cfg.FfmpegDir;
        if (string.IsNullOrWhiteSpace(ffprobeDir) && (ffmpeg.Contains('\\') || ffmpeg.Contains('/')))
            ffprobeDir = Path.GetDirectoryName(ffmpeg);
        var ffprobe = await ToolLocator.FindAsync("ffprobe", ffprobeDir,
            ToolLocator.FfprobeNames, _runner, _cfg, ct).ConfigureAwait(false);
        _ffprobe = ffprobe ?? string.Empty;
        _covers = new CoverMaker(_cfg, _log, _runner, magick);
        _slides = new SlideshowBuilder(_cfg, _log, _runner, ffmpeg);
        _cache = new SegmentCache(cacheDir, _cfg, _log);

        // 6) 扫描文件
        var audios = MediaScanner.ScanDir(audioDir, _audioExt);
        var imageFiles = MediaScanner.ScanDir(imageDir, _imageExt);
        var videoFiles = MediaScanner.ScanDir(imageDir, _videoExt);
        if (audios.Count == 0) throw new InvalidOperationException($"no audio files found in: {audioDir}");
        if (imageFiles.Count == 0 && videoFiles.Count == 0)
            throw new InvalidOperationException($"no image or video files found in: {imageDir}");

        // 图片和视频片段合成一个媒体列表（先按文件名排序，之后整首曲子可以再打乱）
        var media = imageFiles.Select(p => new MediaItem { Path = p, Type = "image" })
            .Concat(videoFiles.Select(p => new MediaItem { Path = p, Type = "video" }))
            .OrderBy(m => m.Path, StringComparer.Ordinal)
            .ToList();

        var fontList = _covers.FontCandidates();
        var fonts = fontList.Count > 0 ? string.Join(" | ", fontList) : "(none found)";

        _log.Write("charset   : UTF-8");
        _log.Write($"image dir : {imageDir} ({imageFiles.Count} images + {videoFiles.Count} videos)");
        _log.Write($"output dir: {outDir}");
        _log.Write($"cache dir : {cacheDir}");
        _log.Write($"video     : {vw}x{vh} @{_cfg.Fps} fps, {_cfg.ImageSeconds:0.###}s per image");
        _log.Write($"fit       : {_cfg.Fit} ({AppConfig.FitLabel(_cfg.Fit)})");
        _log.Write($"tools     : {magick} | {ffmpeg} | {(_ffprobe.Length > 0 ? _ffprobe : "(no ffprobe)")}");
        _log.Write("fonts     : " + fonts);
        _log.Write("cover     : " + (coverSec > 0
            ? $"{coverSec:0.#}s at the start of each mp4 (played once)"
            : "no cover intro (cover_seconds = 0)"));

        _log.Echo($"audio dir : {audioDir} ({audios.Count} file{(audios.Count == 1 ? "" : "s")})");
        _log.Echo($"image dir : {imageDir} ({imageFiles.Count} image{(imageFiles.Count == 1 ? "" : "s")} + {videoFiles.Count} video{(videoFiles.Count == 1 ? "" : "s")})");
        _log.Echo($"output dir: {outDir}");
        _log.Echo($"video     : {vw}x{vh} @{_cfg.Fps} fps, {_cfg.ImageSeconds:0.###}s per image");
        _log.Echo($"fit       : {_cfg.Fit} ({AppConfig.FitLabel(_cfg.Fit)})");
        _log.Echo($"tools     : {magick} | {ffmpeg} | {(_ffprobe.Length > 0 ? _ffprobe : "(none)")}");
        _log.Echo("fonts     : " + fonts);
        _log.Echo("cover     : " + (coverSec > 0 ? $"{coverSec:0.#}s at the start of each mp4 (played once)" : "no cover intro"));
        _log.Echo("log       : " + _log.LogPath);

        // 7) 封面缓存签名：渲染逻辑或配色改过之后旧封面必须重建
        var coverStale = await CheckCoverStampAsync(coverDir, ct).ConfigureAwait(false);

        // 8) 逐个音频处理
        summary.Total = audios.Count;
        var index = 0;
        string? fontUsed = null;

        foreach (var audio in audios)
        {
            ct.ThrowIfCancellationRequested();
            index++;
            _progress?.Invoke(index, summary.Total);
            var baseName = MediaScanner.StripExt(audio);
            var outMp4 = Path.Combine(outDir, baseName + ".mp4");

            if (File.Exists(outMp4) && !_cfg.Force)
            {
                long oldSize;
                try { oldSize = new FileInfo(outMp4).Length; } catch { oldSize = 0; }
                if (oldSize >= AppConfig.MinMp4Size)
                {
                    _log.Echo($"[{index}/{summary.Total}] skip (exists): {baseName}.mp4");
                    summary.Skipped++;
                    continue;
                }
                // 上次失败留下的半成品：删掉重做，否则会被永久跳过
                _log.Warn($"  removing broken output ({oldSize} bytes): {baseName}.mp4");
                if (!_cfg.DryRun) TryDelete(outMp4);
            }

            _log.Echo($"[{index}/{summary.Total}] {baseName}");
            _log.Write($"[{index}/{summary.Total}] {baseName}");

            var (title, artist) = MediaScanner.SplitName(baseName);
            var cover = Path.Combine(coverDir, baseName + ".jpg");
            _log.Write($"TEXT  title={title} artist={artist}");
            _log.Write($"COVER target={cover}");

            // 封面：已存在、不是空画面、且是当前格式生成的才复用
            var haveCover = File.Exists(cover);
            var needCover = !haveCover || _cfg.Force || coverStale;
            if (!needCover && _cfg.VerifyCover && !_cfg.DryRun)
            {
                var sd = await _covers.CoverStddevAsync(cover, ct).ConfigureAwait(false);
                if (sd is not null && sd <= AppConfig.CoverFlat)
                {
                    _log.Warn($"  cover looks blank, regenerating: {baseName}.jpg");
                    needCover = true;
                }
            }

            if (!needCover) _log.FileEntry("cover", cover);
            if (needCover)
            {
                var (coverOk, coverFont) = await _covers.MakeCoverAsync(cover, workDir, title, artist, vw, vh, ct)
                    .ConfigureAwait(false);
                if (coverOk)
                {
                    haveCover = true;
                    if (coverFont is not null && coverFont != fontUsed)
                    {
                        _log.Echo("    cover font: " + coverFont);
                        fontUsed = coverFont;
                    }
                }
                else
                {
                    _log.Warn($"  !! cannot render cover text for: {baseName}");
                    if (File.Exists(cover) && !_cfg.DryRun) TryDelete(cover);
                    haveCover = false;
                    summary.NoCover++;
                }
            }

            // 图片 + 视频片段随机顺序（视频按自身时长整段接入）
            var items = media.Select(m => new MediaItem { Path = m.Path, Type = m.Type, Dur = m.Dur }).ToList();
            if (_cfg.Shuffle) MediaScanner.Shuffle(items, Random.Shared);

            // 片头封面：当成「第一张幻灯片」插进同一个图片片段里，和后面的画面同一趟编码出来
            var coverUsed = 0.0;
            if (coverSec > 0)
            {
                if (haveCover && (_cfg.DryRun || File.Exists(cover)))
                {
                    coverUsed = coverSec;
                    items.Insert(0, new MediaItem { Path = cover, Type = "image", Dur = coverSec, Cover = true });
                    _log.Write($"COVER  intro {coverSec:0.#}s encoded with the first image chunk");
                }
                else if (!_cfg.DryRun)
                {
                    _log.Note("cover_seconds is set but no cover image exists - no cover intro");
                }
            }

            // 视频片段要先知道时长：决定幻灯片总长和「只编码需要的部分」的预算
            foreach (var m in items.Where(m => m.Type == "video" && m.Dur is null))
            {
                if (_cfg.DryRun) break;
                m.Dur = await MediaProbe.ProbeDurationAsync(_runner, _ffprobe, m.Path, ct).ConfigureAwait(false);
                if (m.Dur is null) _log.Note("cannot read the length of some video clips - no trimming");
            }

            // 画面总时长：图片按自身时长算（封面是 cover_seconds，其余是 seconds），视频按自身时长算
            var slidesSec = 0.0;
            var slidesSecKnown = true;
            foreach (var m in items)
            {
                var mediaDur = m.Dur;
                if (m.Type == "video")
                {
                    if (mediaDur is not null) slidesSec += mediaDur.Value;
                    else slidesSecKnown = false;
                }
                else
                {
                    slidesSec += m.Dur ?? _cfg.ImageSeconds;
                }
            }

            double? audioSec = null;
            double? boundSec = null;
            if (!_cfg.DryRun)
            {
                audioSec = await MediaProbe.ProbeDurationAsync(_runner, _ffprobe, audio, ct).ConfigureAwait(false);
                _log.Write(string.Format(CultureInfo.InvariantCulture, "DUR  audio={0} slides={1} cover={2:0.0}s",
                    audioSec is null ? "(unknown)" : $"{audioSec.Value:0.0}s",
                    slidesSecKnown ? $"{slidesSec:0.0}s" : "(unknown)",
                    coverUsed));
                if (audioSec is null) _log.Note("no audio duration (no ffprobe) - the loop count cannot be bounded");

                // 画面只要能铺满音频长度（+1 秒余量）就够了，多余的画面不编码
                if (slidesSecKnown && audioSec is double audioLength && audioLength > 0)
                {
                    var need = Math.Max(audioLength + 1, 1);
                    if (need < slidesSec) boundSec = need;
                }
            }

            // 幻灯片 = 随机抽取到的每一项各编成一个片段（视频片段保留自身时长，每张图按
            // seconds 做成一段视频），再 concat copy 拼成整条
            var slidesMp4 = Path.Combine(workDir, baseName + ".slides.mp4");
            var slidesOk = false;
            var segments = new List<string>();
            string? coverSeg = null;
            var bodySegs = new List<string>();
            string? tailSeg = null;
            var segsCopyable = true;
            var chunks = SlideshowBuilder.SplitItems(items, _cfg.ImageSeconds);
            double? budget = boundSec;
            var usedChunks = 0;

            // 把若干片段拼成一条：参数一致就直接 copy，拼不动时退回滤镜重编。
            // 返回真正的结果文件（只有一段时可能就是原片段），失败返回 null。
            async Task<string?> JoinSegmentsAsync(List<string> parts, string outFile, string tag)
            {
                if (parts.Count == 0) return null;
                if (parts.Count == 1)
                {
                    if (_cfg.DryRun) return outFile;
                    if (File.Exists(outFile)) TryDelete(outFile);
                    return MoveFile(parts[0], outFile) ? outFile : parts[0];
                }
                var list = Path.Combine(workDir, $"{baseName}.{tag}.txt");
                var joined = await _slides.WriteConcatListAsync(list, parts, ct).ConfigureAwait(false)
                             && await _slides.ConcatSegmentsAsync(list, outFile, ct).ConfigureAwait(false);
                if (!_cfg.KeepTemp && !_cfg.DryRun) TryDelete(list);
                if (!joined)
                {
                    _log.Note("segments could not be joined with copy - re-encoding the slideshow");
                    segsCopyable = false;
                    joined = await _slides.ConcatSegmentsFilterAsync(outFile, parts, ct).ConfigureAwait(false);
                }
                return joined ? outFile : null;
            }

            var cacheHitsBefore = _cache.Hits;

            for (var ci = 0; ci < chunks.Count; ci++)
            {
                if (budget is <= 0) break;
                var chunk = chunks[ci];
                var seg = Path.Combine(workDir, $"{baseName}.seg{ci}.mp4");
                var ok = false;
                var chunkDur = chunk.Dur;

                if (chunk.Type == "video")
                {
                    _log.Write($"CHUNK {ci + 1} video {(chunkDur is null ? "?" : Keys.F(chunkDur.Value, 1) + "s")} {chunk.Files[0]}");
                    ok = await _slides.BuildVideoClipAsync(chunk.Files[0], seg, vw, vh, budget, ct).ConfigureAwait(false);
                }
                else
                {
                    // 每张图片（含片头封面）按自己设置好的秒数单独做成一段视频
                    var imgSec = chunkDur ?? _cfg.ImageSeconds;
                    _log.Write($"CHUNK {ci + 1} {(chunk.Cover ? "cover" : "image")} {Keys.F(imgSec, 1)}s {chunk.Files[0]}");
                    // 正文图片走 _cache：同一张图、同一秒数上次编过就直接拷来用；
                    // 片头封面另有 covers 缓存，不重复缓存。
                    if (!_cfg.DryRun && !chunk.Cover && _cache.TryMaterialize(chunk.Files[0], imgSec, seg))
                    {
                        ok = true;
                    }
                    else
                    {
                        ok = await _slides.BuildImageVideoAsync(chunk.Files[0], seg, vw, vh, imgSec, ct).ConfigureAwait(false);
                        if (ok && !_cfg.DryRun && !chunk.Cover) _cache.Store(chunk.Files[0], imgSec, seg);
                    }
                }

                if (ok)
                {
                    segments.Add(seg);
                    if (chunk.Cover) coverSeg = seg;
                    else bodySegs.Add(seg);
                    usedChunks = ci + 1;
                }
                else
                {
                    _log.Warn($"  !! chunk {ci + 1} failed, skipped: {baseName}");
                    usedChunks = ci + 1;
                }

                if (budget is double budgetLeft && chunkDur is double usedSec && usedSec > 0)
                    budget = Math.Max(0, budgetLeft - usedSec);
            }

            if (usedChunks < chunks.Count)
                _log.Write($"CHUNK skipped {chunks.Count - usedChunks} chunk(s): the audio is shorter than the slideshow");

            var cacheHits = _cache.Hits - cacheHitsBefore;
            if (cacheHits > 0) _log.Echo($"    cache: {cacheHits} image segment(s) reused");

            if (segments.Count > 0)
            {
                var joined = await JoinSegmentsAsync(segments, slidesMp4, "segs").ConfigureAwait(false);
                if (joined is not null) { slidesMp4 = joined; slidesOk = true; }
            }

            // 片头封面只播一次：正片单独拼成一条，循环时重复的是它，而不是一堆小片段
            string? bodyMp4 = null;
            if (coverSeg is not null && bodySegs.Count > 0)
                bodyMp4 = await JoinSegmentsAsync(bodySegs, Path.Combine(workDir, baseName + ".body.mp4"), "body")
                    .ConfigureAwait(false);

            if (!_cfg.DryRun) _log.FileEntry("slides", slidesMp4);

            // 幻灯片的实际时长（ffprobe 量出来的）：循环次数按它定
            var slidesInfo = _cfg.DryRun
                ? new VideoInfo()
                : await MediaProbe.ProbeVideoInfoAsync(_runner, _ffprobe, slidesMp4, ct).ConfigureAwait(false);
            var slidesDur = slidesInfo.Duration;
            var slidesBytes = slidesInfo.Size;
            if (slidesDur is double slidesDuration && slidesDuration > 0 && slidesBytes is long slidesSize)
                _log.Write(string.Format(CultureInfo.InvariantCulture, "SLIDES {0:0.0}s  {1} bytes  (~{2:0} kbps)",
                    slidesDuration, slidesSize, slidesSize * 8.0 / slidesDuration / 1000.0));

            var slidesExpect = slidesSec;
            if (boundSec is not null && boundSec < slidesExpect) slidesExpect = boundSec.Value;
            if (slidesDur is double measuredDur && slidesExpect > 0 && measuredDur + 0.5 < slidesExpect * 0.6)
            {
                _log.Warn($"  !! slideshow is only {measuredDur:0.0}s, the media should add up to {slidesExpect:0.0}s");
                _log.Warn("     (images are not being held for the configured seconds)");
            }

            var videoOk = false;
            if (slidesOk)
            {
                // 循环列表：片头封面单独排在最前面，只播一次；后面重复的是「正片」。
                // 循环次数取整后剩下的零头 (rem) 不再从第一张图重播 —— 那样成片的片头
                // 会在片尾原样再出现一遍；改成把图片重新洗牌编一小段收尾，片尾就是新内容。
                string? loopList = null;
                var loops = 0;
                var head = false;
                if (!_cfg.DryRun && audioSec is double audioDuration && audioDuration > 0)
                {
                    head = coverSeg is not null && bodyMp4 is not null && segsCopyable;
                    var round = head ? new List<string> { bodyMp4! } : new List<string> { slidesMp4 };
                    var headSec = head ? coverUsed : 0;
                    var roundSec = slidesDur is double slideLen && slideLen > 0 ? slideLen : slidesSec;
                    roundSec -= headSec;   // 幻灯片总长里去掉只播一次的封面
                    if (roundSec > 0)
                    {
                        var need = Math.Max(audioDuration - headSec, 0);
                        var full = (int)(need / roundSec);          // 完整播几遍
                        if (full > 20000) full = 20000;
                        var rem = need - full * roundSec;            // 不足一整遍的零头

                        // 零头太小时不值得单独编一段：来回都只是一两帧的画面
                        var tailEps = Math.Max(0.25, 1.0 / Math.Max(1, _cfg.Fps));
                        if (full >= 1 && rem > tailEps && slidesDur is double slideDur && slideDur - headSec > rem)
                        {
                            // 零头用重新洗牌的图片编一段：片尾不会原样重复片头，
                            // 也不会紧挨着回放幻灯片结尾。图片不够/编不出来时退回「从幻灯片末尾裁一段」。
                            var pictures = items.Where(m => m.Type == "image" && !m.Cover)
                                                .Select(m => m.Path).ToList();
                            // 收尾段前面最后一个画面：如果它也是图片，收尾段不能再拿它打头，
                            // 否则同一张图会连着显示两倍「每图秒数」，看起来就是这张图变长了。
                            var lastItem = items.LastOrDefault(m => !m.Cover);
                            var avoidFirst = lastItem is { Type: "image" } ? lastItem.Path : null;
                            var tailFile = Path.Combine(workDir, baseName + ".tail.mp4");
                            var tailList = Path.Combine(workDir, baseName + ".tail.txt");
                            tailSeg = await _slides.BuildReshuffledTailAsync(
                                    pictures, tailFile, rem, vw, vh, tailList, avoidFirst, ct).ConfigureAwait(false)
                                ?? await _slides.BuildTailFragmentAsync(
                                    slidesMp4, slideDur, headSec, rem, tailFile, vw, vh, ct).ConfigureAwait(false);
                            if (!_cfg.KeepTemp && !_cfg.DryRun) TryDelete(tailList);
                        }

                        var parts = new List<string>();
                        if (head) parts.Add(coverSeg!);
                        for (var i = 0; i < full; i++) parts.AddRange(round);
                        if (tailSeg is not null) parts.Add(tailSeg);
                        else if (rem > 0) parts.AddRange(round);     // 裁不出收尾段就退回「多播一遍，让 -t 裁掉」
                        loops = full + (rem > 0 ? 1 : 0);

                        var lp = Path.Combine(workDir, baseName + ".loop.txt");
                        if (await _slides.WriteConcatListAsync(lp, parts, ct).ConfigureAwait(false)) loopList = lp;
                    }
                }

                _log.Write(string.Format(CultureInfo.InvariantCulture,
                    "MERGE  cover {0:0.0}s {1} + video loop x{2}{3} (copy), output capped at {4}",
                    coverUsed,
                    head ? "once at the front" : "in the slideshow",
                    loops,
                    tailSeg is not null ? " + fresh tail" : "",
                    audioSec is double audioLen ? $"{audioLen:0.0}s" : "audio end"));

                videoOk = await _slides.MakeVideoAsync(slidesMp4, loopList, audio, outMp4, audioSec, ct).ConfigureAwait(false);
                if (!_cfg.DryRun && videoOk)
                {
                    long size2;
                    try { size2 = new FileInfo(outMp4).Length; } catch { size2 = 0; }
                    if (size2 < AppConfig.MinMp4Size)
                    {
                        _log.Warn($"  !! output file looks broken: {outMp4}");
                        videoOk = false;
                    }
                }
            }

            if (!_cfg.KeepTemp)
            {
                TryDelete(slidesMp4);
                if (bodyMp4 is not null && !string.Equals(bodyMp4, slidesMp4, StringComparison.OrdinalIgnoreCase)) TryDelete(bodyMp4);
                if (tailSeg is not null) TryDelete(tailSeg);
                foreach (var seg in segments) TryDelete(seg);
                foreach (var name in new[] { "title.txt", "artist.txt", "cover_text.txt", "cover_text.png", "title_line.png", "artist_line.png" })
                    TryDelete(Path.Combine(workDir, name));
                TryDelete(Path.Combine(workDir, baseName + ".loop.txt"));
            }
            if (!_cfg.KeepCover && haveCover && File.Exists(cover) && !_cfg.DryRun) TryDelete(cover);

            if (videoOk)
            {
                _log.Echo("    ok: " + outMp4);
                _log.FileEntry("mp4", outMp4);
                var info = await MediaProbe.ProbeVideoInfoAsync(_runner, _ffprobe, outMp4, ct).ConfigureAwait(false);
                _log.Write($"VIDEO {baseName}.mp4 -> {MediaProbe.FormatVideoInfo(info)}");
                WarnHighBitrate(info);
                // 成片时长必须和音频对齐：长出一截说明循环没被剪到音频结束（体积会失控）
                var outDur = info.Duration;
                if (audioSec is double audioDur && outDur is double outDuration
                    && Math.Abs(outDuration - audioDur) > audioDur * 0.05 + 1)
                {
                    _log.Warn(string.Format(CultureInfo.InvariantCulture,
                        "  !! output is {0:0.0}s but the audio is {1:0.0}s - the video loop was not cut to the audio",
                        outDuration, audioDur));
                }
                summary.Ok++;
            }
            else
            {
                // 失败时清掉半成品，下次运行才会重做，而不是「skip (exists)」
                if (!_cfg.DryRun && File.Exists(outMp4)) TryDelete(outMp4);
                _log.Warn("  !! failed: " + baseName);
                summary.Failed++;
            }
        }

        // 清理空目录
        if (!_cfg.KeepTemp && !_cfg.DryRun)
        {
            try
            {
                if (Directory.Exists(workDir) && !Directory.EnumerateFileSystemEntries(workDir).Any())
                    Directory.Delete(workDir);
            }
            catch { }
        }

        _log.Echo(new string('-', 60));
        _log.Echo($"done: {summary.Ok} ok, {summary.Skipped} skipped, {summary.Failed} failed (total {summary.Total})");
        if (summary.NoCover > 0)
        {
            _log.Echo($"warning: {summary.NoCover} cover image(s) could not be rendered (see the note: lines above).");
            _log.Echo("         fix the font, e.g. set the font to C:\\Windows\\Fonts\\msyh.ttc, then rerun with force.");
        }
        _log.Write($"done: {summary.Ok} ok, {summary.Skipped} skipped, {summary.Failed} failed (total {summary.Total})");
        return summary;
    }

    /// <summary>
    /// 封面是按文件名缓存的，只看「非空」不够：渲染逻辑或配色改过之后旧封面必须重建。
    /// 把封面格式版本和相关配置写成签名存进 covers 目录，签名变了就强制重建。
    /// </summary>
    private async Task<bool> CheckCoverStampAsync(string coverDir, CancellationToken ct)
    {
        var stamp = Path.Combine(coverDir, ".cover_format");
        var sig = string.Join('|',
            AppConfig.CoverFormat.ToString(CultureInfo.InvariantCulture),
            _cfg.Size ?? "-",
            _cfg.Font ?? "-",
            _cfg.CoverColor ?? "-",
            _cfg.TitleColor ?? "-",
            _cfg.ArtistColor ?? "-",
            _cfg.TitleSize?.ToString(CultureInfo.InvariantCulture) ?? "-",
            _cfg.ArtistSize?.ToString(CultureInfo.InvariantCulture) ?? "-");

        var stale = true;
        try
        {
            if (File.Exists(stamp))
                stale = !string.Equals(await File.ReadAllTextAsync(stamp, Encoding.UTF8, ct).ConfigureAwait(false), sig, StringComparison.Ordinal);
        }
        catch { stale = true; }

        if (stale)
        {
            var old = 0;
            try { old = Directory.GetFiles(coverDir).Count(f => !Path.GetFileName(f).StartsWith('.')); } catch { }
            if (old > 0) _log.Echo($"cover format/settings changed: {old} cached cover(s) will be regenerated");
            if (!_cfg.DryRun)
            {
                try { await File.WriteAllTextAsync(stamp, sig, new UTF8Encoding(false), ct).ConfigureAwait(false); }
                catch { }
            }
        }
        return stale;
    }

    private void WarnHighBitrate(VideoInfo info)
    {
        if (_warnedBitrate) return;
        var kbps = MediaProbe.AverageKbps(info);
        if (kbps is null || kbps < 2500) return;
        _warnedBitrate = true;
        _log.Echo($"    note: video bitrate is high ({kbps:0} kbps).");
        _log.Echo("          try crf = 26~28, fps = 10~15, preset = veryfast in the ini");
        _log.Write($"NOTE high bitrate {kbps:0} kbps (crf/fps/preset may need tuning)");
    }

    private void EnsureDir(string dir)
    {
        if (Directory.Exists(dir)) return;
        if (_cfg.DryRun) return;
        Directory.CreateDirectory(dir);
    }

    private static bool MoveFile(string from, string to)
    {
        try { File.Move(from, to, overwrite: true); return true; }
        catch { return false; }
    }

    private static void TryDelete(string path)
    {
        try { if (File.Exists(path)) File.Delete(path); } catch { }
    }
}
