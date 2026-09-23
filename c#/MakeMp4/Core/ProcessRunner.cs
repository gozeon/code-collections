using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MakeMp4.Core;

/// <summary>
/// 外部命令执行器：不走 shell（参数不会被二次解析），把 stdout + stderr 一并收回，
/// 支持 --dry-run（只回显命令）与取消（结束子进程）。
/// </summary>
public sealed class ProcessRunner
{
    private readonly AppConfig _cfg;
    private readonly JobLogger _log;

    public ProcessRunner(AppConfig cfg, JobLogger log)
    {
        _cfg = cfg;
        _log = log;
    }

    /// <summary>执行命令，只关心成功与否。命令失败时把原因回显出来。</summary>
    public async Task<bool> RunAsync(IReadOnlyList<string> args, CancellationToken ct)
    {
        var (ok, output, _) = await RunInternalAsync(args, captureOutput: false, ct).ConfigureAwait(false);
        if (!ok && output.Length > 0)
        {
            foreach (var line in SplitLines(output)) _log.Echo("    ! " + line);
        }
        return ok;
    }

    /// <summary>同 RunAsync，但把输出也记进日志（OUT 行），并返回 (是否成功, 全部输出)。</summary>
    public async Task<(bool Ok, string Output)> RunOutAsync(IReadOnlyList<string> args, CancellationToken ct)
    {
        var (ok, output, _) = await RunInternalAsync(args, captureOutput: true, ct).ConfigureAwait(false);
        if (!ok)
        {
            _log.Warn("    command failed: " + Text(args));
            foreach (var line in SplitLines(output)) _log.Echo("    ! " + line);
        }
        return (ok, output);
    }

    /// <summary>探测类命令：结果折成一行记进日志（PROBE 行），返回原始输出。</summary>
    public async Task<string> CaptureAsync(IReadOnlyList<string> args, CancellationToken ct)
    {
        var text = _log.Cmd(args);
        if (_cfg.DryRun) return string.Empty;
        var (_, output, _) = await RunRawAsync(args, captureOutput: true, ct).ConfigureAwait(false);
        _log.Write($"PROBE {text} -> {JobLogger.OneLine(output)}");
        return output;
    }

    private async Task<(bool Ok, string Output, int ExitCode)> RunInternalAsync(
        IReadOnlyList<string> args, bool captureOutput, CancellationToken ct)
    {
        var text = _log.Cmd(args);
        if (_cfg.DryRun)
        {
            _log.Echo("    [dry-run] " + text);
            return (true, string.Empty, 0);
        }

        var started = DateTime.UtcNow;
        var (ok, output, exitCode) = await RunRawAsync(args, captureOutput: true, ct, tailLines: captureOutput ? 0 : 400)
            .ConfigureAwait(false);
        var elapsed = (int)(DateTime.UtcNow - started).TotalSeconds;
        _log.Write($"EXIT {(ok ? "ok" : "FAIL " + exitCode)}  ({elapsed}s)  {text}");
        if (captureOutput)
        {
            foreach (var line in SplitLines(output))
                if (!string.IsNullOrWhiteSpace(line)) _log.Write("OUT  " + line);
        }
        return (ok, output, exitCode);
    }

    private static async Task<(bool Ok, string Output, int ExitCode)> RunRawAsync(
        IReadOnlyList<string> args, bool captureOutput, CancellationToken ct, int tailLines = 0)
    {
        var psi = new ProcessStartInfo
        {
            FileName = args[0],
            UseShellExecute = false,
            CreateNoWindow = true,
            RedirectStandardOutput = captureOutput,
            RedirectStandardError = captureOutput,
            StandardOutputEncoding = Encoding.UTF8,
            StandardErrorEncoding = Encoding.UTF8,
        };
        for (var i = 1; i < args.Count; i++) psi.ArgumentList.Add(args[i]);

        using var proc = new Process { StartInfo = psi };
        var buffer = new StringBuilder();
        // tailLines > 0：只保留最后若干行（ffmpeg 的进度输出会刷屏，全留着没意义）
        var tail = tailLines > 0 ? new Queue<string>(tailLines + 1) : null;
        try
        {
            if (!proc.Start()) return (false, "cannot start: " + args[0], -1);
        }
        catch (Exception ex)
        {
            return (false, ex.Message, -1);
        }

        if (captureOutput)
        {
            void Sink(string? data)
            {
                if (data is null) return;
                if (tail is null) { buffer.AppendLine(data); return; }
                tail.Enqueue(data);
                while (tail.Count > tailLines) tail.Dequeue();
            }
            proc.OutputDataReceived += (_, e) => Sink(e.Data);
            proc.ErrorDataReceived += (_, e) => Sink(e.Data);
            proc.BeginOutputReadLine();
            proc.BeginErrorReadLine();
        }

        try
        {
            await proc.WaitForExitAsync(ct).ConfigureAwait(false);
        }
        catch (OperationCanceledException)
        {
            TryKill(proc);
            throw;
        }

        // WaitForExitAsync 返回后再调用一次无参 WaitForExit，确保异步读取的回调都跑完
        proc.WaitForExit();
        var text = tail is null ? buffer.ToString() : string.Join('\n', tail);
        return (proc.ExitCode == 0, text, proc.ExitCode);
    }

    private static void TryKill(Process proc)
    {
        try { if (!proc.HasExited) proc.Kill(entireProcessTree: true); } catch { }
    }

    public static string Text(IReadOnlyList<string> args) =>
        string.Join(' ', args.Select(Keys.QuoteArg));

    private static IEnumerable<string> SplitLines(string s) =>
        s.Replace("\r\n", "\n").Split('\n');
}
