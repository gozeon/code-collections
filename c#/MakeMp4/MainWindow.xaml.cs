using System;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using Microsoft.Win32;
using MakeMp4.Core;

namespace MakeMp4
{
    /// <summary>
    /// 界面：收集 ini 里的那套配置，然后跑 <see cref="MakeMp4Runner"/>。
    /// 运行日志既进日志文件，也追加到下面的文本框。
    /// </summary>
    public partial class MainWindow : Window
    {
        private CancellationTokenSource? _cts;
        private JobLogger? _logger;
        private bool _running;

        public MainWindow()
        {
            InitializeComponent();
            Preset.ItemsSource = AppConfig.X264Presets;
            FitMode.ItemsSource = AppConfig.FitOptions;
            Loaded += MainWindow_Loaded;
            PreviewKeyDown += (_, e) =>
            {
                if (e.Key == System.Windows.Input.Key.F5 && !_running) Start_Click(this, new RoutedEventArgs());
            };
        }

        private void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            var ini = AppConfig.FindDefaultIni();
            if (ini is not null) LoadIniIntoUi(ini);
            else ApplyConfigToUi(new AppConfig());
        }

        // ------------------------------------------------------------------
        // 配置文件
        // ------------------------------------------------------------------

        private void LoadIni_Click(object sender, RoutedEventArgs e)
        {
            var dlg = new OpenFileDialog
            {
                Title = "选择 make_mp4.ini",
                Filter = "配置文件 (*.ini)|*.ini|所有文件 (*.*)|*.*",
                CheckFileExists = true,
            };
            if (dlg.ShowDialog(this) == true) LoadIniIntoUi(dlg.FileName);
        }

        private void LoadIniIntoUi(string path)
        {
            try
            {
                var (cfg, cleaned) = AppConfig.FromIni(path);
                ApplyConfigToUi(cfg);
                ConfigFile.Text = path;
                if (cleaned) AppendLine("! 配置里含有不可见字符（零宽/双向控制符），已自动清理。");
                AppendLine($"已载入配置：{path}");
            }
            catch (Exception ex)
            {
                MessageBox.Show(this, "读取配置失败：" + ex.Message, "MakeMp4", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
        }

        private void SaveIni_Click(object sender, RoutedEventArgs e)
        {
            var dlg = new SaveFileDialog
            {
                Title = "保存 make_mp4.ini",
                FileName = "make_mp4.ini",
                Filter = "配置文件 (*.ini)|*.ini|所有文件 (*.*)|*.*",
                OverwritePrompt = true,
            };
            if (dlg.ShowDialog(this) != true) return;
            try
            {
                File.WriteAllText(dlg.FileName, ConfigToIniText(), new UTF8Encoding(false));
                ConfigFile.Text = dlg.FileName;
                AppendLine($"已保存配置：{dlg.FileName}");
            }
            catch (Exception ex)
            {
                MessageBox.Show(this, "保存配置失败：" + ex.Message, "MakeMp4", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
        }

        private string ConfigToIniText()
        {
            var sb = new StringBuilder();
            sb.AppendLine("# MakeMp4 配置（UTF-8 编码保存，# 后面是注释）");
            sb.AppendLine();
            sb.AppendLine("# 音频目录（文件名格式: 歌曲名-作者.mp3）");
            sb.AppendLine("audio_dir = " + Audio.Text.Trim());
            sb.AppendLine();
            sb.AppendLine("# 图片目录（文件名格式: Image00001.jpg，五位递增；也可以放视频片段）");
            sb.AppendLine("image_dir = " + Images.Text.Trim());
            sb.AppendLine();
            sb.AppendLine("# 输出目录，不填则为「音频目录\\out」");
            if (!string.IsNullOrWhiteSpace(Out.Text)) sb.AppendLine("out_dir = " + Out.Text.Trim());
            else sb.AppendLine("#out_dir = ");
            sb.AppendLine();
            if (!string.IsNullOrWhiteSpace(Font.Text)) sb.AppendLine("font = " + Font.Text.Trim());
            else sb.AppendLine("#font = C:\\Windows\\Fonts\\msyh.ttc");
            sb.AppendLine();
            sb.AppendLine("size = " + SizeBox.Text.Trim());
            sb.AppendLine("fps = " + Fps.Text.Trim());
            sb.AppendLine("seconds = " + Seconds.Text.Trim());
            sb.AppendLine("cover_seconds = " + CoverSeconds.Text.Trim());
            sb.AppendLine();
            sb.AppendLine("cover_color = " + CoverColor.Text.Trim());
            sb.AppendLine("title_color = " + TitleColor.Text.Trim());
            sb.AppendLine("artist_color = " + ArtistColor.Text.Trim());
            if (!string.IsNullOrWhiteSpace(TitleSize.Text)) sb.AppendLine("title_size = " + TitleSize.Text.Trim());
            if (!string.IsNullOrWhiteSpace(ArtistSize.Text)) sb.AppendLine("artist_size = " + ArtistSize.Text.Trim());
            sb.AppendLine();
            sb.AppendLine("vcodec = " + VCodec.Text.Trim());
            sb.AppendLine("crf = " + Crf.Text.Trim());
            sb.AppendLine("preset = " + Preset.Text.Trim());
            sb.AppendLine("abitrate = " + ABitrate.Text.Trim());
            sb.AppendLine("pad_color = " + PadColor.Text.Trim());
            sb.AppendLine("# 图片自适应: contain = 等比缩放补边（默认）, width = 宽度自适应（高度铺满）, height = 高度自适应（宽度铺满）");
            sb.AppendLine("fit = " + (FitMode.SelectedValue as string ?? AppConfig.DefaultFit));
            sb.AppendLine();
            sb.AppendLine("# 其它开关: 1 开 / 0 关");
            sb.AppendLine("shuffle = " + (Shuffle.IsChecked == true ? 1 : 0));
            sb.AppendLine("force = " + (Force.IsChecked == true ? 1 : 0));
            sb.AppendLine("keep_temp = " + (KeepTemp.IsChecked == true ? 1 : 0));
            sb.AppendLine("verify_cover = " + (VerifyCover.IsChecked == true ? 1 : 0));
            sb.AppendLine("keep_cover = " + (KeepCover.IsChecked == true ? 1 : 0));
            sb.AppendLine("dry_run = " + (DryRun.IsChecked == true ? 1 : 0));
            sb.AppendLine();
            sb.AppendLine("# 外部程序目录（一般不用填，会自动在 PATH 里查找）");
            if (!string.IsNullOrWhiteSpace(MagickDir.Text)) sb.AppendLine("magick_dir = " + MagickDir.Text.Trim());
            else sb.AppendLine("#magick_dir = C:\\Program Files\\ImageMagick-7.1.1-Q16-HDRI");
            if (!string.IsNullOrWhiteSpace(FfmpegDir.Text)) sb.AppendLine("ffmpeg_dir = " + FfmpegDir.Text.Trim());
            else sb.AppendLine("#ffmpeg_dir = C:\\ffmpeg\\bin");
            return sb.ToString();
        }

        private void ApplyConfigToUi(AppConfig cfg)
        {
            Audio.Text = cfg.AudioDir ?? string.Empty;
            Images.Text = cfg.ImageDir ?? string.Empty;
            Out.Text = cfg.OutDir ?? string.Empty;
            Font.Text = cfg.Font ?? string.Empty;
            SizeBox.Text = cfg.Size;
            Fps.Text = cfg.Fps.ToString(CultureInfo.InvariantCulture);
            Seconds.Text = cfg.Seconds.ToString("0.###", CultureInfo.InvariantCulture);
            CoverSeconds.Text = cfg.CoverSeconds.ToString("0.###", CultureInfo.InvariantCulture);
            CoverColor.Text = cfg.CoverColor;
            TitleColor.Text = cfg.TitleColor;
            ArtistColor.Text = cfg.ArtistColor;
            TitleSize.Text = cfg.TitleSize?.ToString(CultureInfo.InvariantCulture) ?? string.Empty;
            ArtistSize.Text = cfg.ArtistSize?.ToString(CultureInfo.InvariantCulture) ?? string.Empty;
            VCodec.Text = cfg.VCodec;
            Crf.Text = cfg.Crf.ToString(CultureInfo.InvariantCulture);
            Preset.Text = cfg.Preset;
            ABitrate.Text = cfg.ABitrate;
            PadColor.Text = cfg.PadColor;
            FitMode.SelectedValue = AppConfig.NormalizeFit(cfg.Fit);
            Shuffle.IsChecked = cfg.Shuffle;
            VerifyCover.IsChecked = cfg.VerifyCover;
            Force.IsChecked = cfg.Force;
            KeepTemp.IsChecked = cfg.KeepTemp;
            KeepCover.IsChecked = cfg.KeepCover;
            DryRun.IsChecked = cfg.DryRun;
            MagickDir.Text = cfg.MagickDir ?? string.Empty;
            FfmpegDir.Text = cfg.FfmpegDir ?? string.Empty;
        }

        // ------------------------------------------------------------------
        // 浏览
        // ------------------------------------------------------------------

        private void BrowseAudio_Click(object sender, RoutedEventArgs e) => PickFolder(Audio, "选择音频目录");
        private void BrowseImages_Click(object sender, RoutedEventArgs e) => PickFolder(Images, "选择图片目录");

        private void BrowseOut_Click(object sender, RoutedEventArgs e) => PickFolder(Out, "选择输出目录");

        private void BrowseFont_Click(object sender, RoutedEventArgs e) => PickFile(Font, "选择封面字体",
            "字体 (*.ttf;*.ttc;*.otf;*.otc)|*.ttf;*.ttc;*.otf;*.otc|所有文件 (*.*)|*.*");

        private void BrowseMagick_Click(object sender, RoutedEventArgs e) =>
            PickFolder(MagickDir, "选择 ImageMagick 目录（含 magick.exe）");

        private void BrowseFfmpeg_Click(object sender, RoutedEventArgs e) =>
            PickFolder(FfmpegDir, "选择 ffmpeg 目录（含 ffmpeg.exe / ffprobe.exe）");

        private void PickFolder(System.Windows.Controls.TextBox target, string title)
        {
            var dlg = new OpenFolderDialog { Title = title };
            if (!string.IsNullOrWhiteSpace(target.Text) && Directory.Exists(target.Text))
                dlg.InitialDirectory = target.Text;
            if (dlg.ShowDialog(this) == true) target.Text = dlg.FolderName;
        }

        private void PickFile(System.Windows.Controls.TextBox target, string title, string filter)
        {
            var dlg = new OpenFileDialog { Title = title, Filter = filter, CheckFileExists = true };
            if (dlg.ShowDialog(this) == true) target.Text = dlg.FileName;
        }

        // ------------------------------------------------------------------
        // 运行
        // ------------------------------------------------------------------

        private AppConfig? BuildConfig(out string? error)
        {
            error = null;
            var cfg = new AppConfig
            {
                AudioDir = Audio.Text.Trim(),
                ImageDir = Images.Text.Trim(),
                OutDir = string.IsNullOrWhiteSpace(Out.Text) ? null : Out.Text.Trim(),
                Font = string.IsNullOrWhiteSpace(Font.Text) ? null : Font.Text.Trim(),
                Size = SizeBox.Text.Trim(),
                CoverColor = CoverColor.Text.Trim(),
                TitleColor = TitleColor.Text.Trim(),
                ArtistColor = ArtistColor.Text.Trim(),
                VCodec = VCodec.Text.Trim(),
                Preset = string.IsNullOrWhiteSpace(Preset.Text) ? "ultrafast" : Preset.Text.Trim(),
                Fit = FitMode.SelectedValue as string ?? AppConfig.DefaultFit,
                ABitrate = ABitrate.Text.Trim(),
                PadColor = string.IsNullOrWhiteSpace(PadColor.Text) ? "black" : PadColor.Text.Trim(),
                Shuffle = Shuffle.IsChecked == true,
                VerifyCover = VerifyCover.IsChecked == true,
                Force = Force.IsChecked == true,
                KeepTemp = KeepTemp.IsChecked == true,
                KeepCover = KeepCover.IsChecked == true,
                DryRun = DryRun.IsChecked == true,
                MagickDir = string.IsNullOrWhiteSpace(MagickDir.Text) ? null : MagickDir.Text.Trim(),
                FfmpegDir = string.IsNullOrWhiteSpace(FfmpegDir.Text) ? null : FfmpegDir.Text.Trim(),
            };

            if (!TryInt(Fps.Text, 25, out var fps) || fps <= 0) { error = "帧率必须是正整数。"; return null; }
            cfg.Fps = fps;

            if (!TryDouble(Seconds.Text, 5, out var seconds) || seconds < 0) { error = "每图秒数必须是数字。"; return null; }
            cfg.Seconds = seconds;

            if (!TryDouble(CoverSeconds.Text, 2, out var coverSec) || coverSec < 0) { error = "封面秒数必须是数字（0 = 不插封面）。"; return null; }
            cfg.CoverSeconds = coverSec;

            if (!TryInt(Crf.Text, 23, out var crf)) { error = "CRF 必须是整数。"; return null; }
            cfg.Crf = crf;

            if (!string.IsNullOrWhiteSpace(TitleSize.Text))
            {
                if (!TryInt(TitleSize.Text, 0, out var ts) || ts <= 0) { error = "歌名字号必须是正整数。"; return null; }
                cfg.TitleSize = ts;
            }
            if (!string.IsNullOrWhiteSpace(ArtistSize.Text))
            {
                if (!TryInt(ArtistSize.Text, 0, out var asc) || asc <= 0) { error = "作者字号必须是正整数。"; return null; }
                cfg.ArtistSize = asc;
            }

            if (string.IsNullOrWhiteSpace(cfg.AudioDir)) { error = "请先选择音频目录。"; return null; }
            if (string.IsNullOrWhiteSpace(cfg.ImageDir)) { error = "请先选择图片目录。"; return null; }
            if (cfg.ParseSize() is null) { error = "尺寸格式不对，示例：1280x720。"; return null; }
            return cfg;
        }

        private static bool TryInt(string text, int fallback, out int value) =>
            int.TryParse(string.IsNullOrWhiteSpace(text) ? fallback.ToString(CultureInfo.InvariantCulture) : text.Trim(),
                NumberStyles.Integer, CultureInfo.InvariantCulture, out value);

        private static bool TryDouble(string text, double fallback, out double value) =>
            double.TryParse(string.IsNullOrWhiteSpace(text) ? fallback.ToString(CultureInfo.InvariantCulture) : text.Trim(),
                NumberStyles.Float, CultureInfo.InvariantCulture, out value);

        private async void Start_Click(object sender, RoutedEventArgs e)
        {
            if (_running) return;
            var cfg = BuildConfig(out var error);
            if (cfg is null)
            {
                MessageBox.Show(this, error, "MakeMp4", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            _running = true;
            StartButton.IsEnabled = false;
            CancelButton.IsEnabled = true;
            Progress.IsIndeterminate = true;
            Status.Text = "运行中…";
            LogBox.Clear();
            AppendLine("=== MakeMp4 ===");

            _cts = new CancellationTokenSource();
            _logger = new JobLogger(AppendLine, AppendWarn);
            try
            {
                var runner = new MakeMp4Runner(cfg, _logger, ConfigFile.Text, ReportProgress);
                var token = _cts.Token;
                var summary = await Task.Run(() => runner.RunAsync(token), token);
                Status.Text = $"{summary.Ok} 成功 / {summary.Skipped} 跳过 / {summary.Failed} 失败（共 {summary.Total}）";
            }
            catch (OperationCanceledException)
            {
                AppendWarn("已取消。");
                Status.Text = "已取消";
            }
            catch (Exception ex)
            {
                AppendWarn("错误：" + ex.Message);
                Status.Text = "出错";
            }
            finally
            {
                _logger?.Close();
                _logger = null;
                Progress.IsIndeterminate = false;
                CancelButton.IsEnabled = false;
                StartButton.IsEnabled = true;
                _running = false;
                _cts?.Dispose();
                _cts = null;
            }
        }

        private void ReportProgress(int done, int total)
        {
            if (!Dispatcher.CheckAccess())
            {
                Dispatcher.BeginInvoke(new Action<int, int>(ReportProgress), done, total);
                return;
            }
            Progress.IsIndeterminate = false;
            Progress.Maximum = Math.Max(total, 1);
            Progress.Value = Math.Min(done, Progress.Maximum);
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            try { _cts?.Cancel(); } catch { }
            Status.Text = "正在取消…";
        }

        private void OpenOut_Click(object sender, RoutedEventArgs e)
        {
            var dir = Out.Text.Trim();
            if (dir.Length == 0 && !string.IsNullOrWhiteSpace(Audio.Text))
                dir = Path.Combine(Audio.Text.Trim(), "out");
            if (dir.Length == 0 || !Directory.Exists(dir))
            {
                MessageBox.Show(this, "输出目录还不存在。", "MakeMp4", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }
            try
            {
                Process.Start(new ProcessStartInfo { FileName = dir, UseShellExecute = true });
            }
            catch (Exception ex)
            {
                MessageBox.Show(this, "打开目录失败：" + ex.Message, "MakeMp4", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
        }

        private void ClearLog_Click(object sender, RoutedEventArgs e) => LogBox.Clear();

        // ------------------------------------------------------------------
        // 日志输出（后台线程 → UI 线程）
        // ------------------------------------------------------------------

        private void AppendLine(string text)
        {
            if (!Dispatcher.CheckAccess())
            {
                Dispatcher.BeginInvoke(new Action<string>(AppendLine), text);
                return;
            }
            LogBox.AppendText(text.TrimEnd('\r', '\n') + Environment.NewLine);
            if (AutoScroll.IsChecked == true) LogBox.ScrollToEnd();
        }

        private void AppendWarn(string text)
        {
            if (!Dispatcher.CheckAccess())
            {
                Dispatcher.BeginInvoke(new Action<string>(AppendWarn), text);
                return;
            }
            AppendLine(text.StartsWith('!') || text.StartsWith("  !!") ? text : "! " + text);
        }

        protected override void OnClosed(EventArgs e)
        {
            try { _cts?.Cancel(); } catch { }
            _logger?.Close();
            base.OnClosed(e);
        }
    }
}
