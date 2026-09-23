using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace MakeMp4.Core;

/// <summary>
/// 运行日志：&lt;输出目录&gt;/make_mp4.log，逐条记录命令（CMD）、退出码（EXIT）、
/// 命令输出（OUT/PROBE）、封面取舍（COVER）与产出文件及大小（FILE）。
/// 同时把同样的内容回显到界面/控制台。
/// </summary>
public sealed class JobLogger
{
    private readonly object _gate = new();
    private readonly Action<string> _console;
    private readonly Action<string> _warn;
    private readonly HashSet<string> _reasons = new(StringComparer.OrdinalIgnoreCase);
    private StreamWriter? _writer;

    public JobLogger(Action<string> console, Action<string> warn)
    {
        _console = console;
        _warn = warn;
    }

    public string? LogPath { get; private set; }

    public bool Opened => _writer is not null;

    /// <summary>打开（追加）日志文件。</summary>
    public bool Open(string path)
    {
        LogPath = path;
        try
        {
            _writer = new StreamWriter(path, append: true, new UTF8Encoding(false));
            _writer.Flush();
        }
        catch (Exception ex)
        {
            Warn($"Cannot write log: {path} ({ex.Message})");
            return false;
        }
        Write("=== MakeMp4 run " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " ===");
        return true;
    }

    public void Close()
    {
        lock (_gate)
        {
            _writer?.Dispose();
            _writer = null;
        }
    }

    /// <summary>一行一条写进日志（传进来的内容可以带换行）。</summary>
    public void Write(string message)
    {
        if (message is null) return;
        lock (_gate)
        {
            if (_writer is null) return;
            foreach (var line in message.Split('\n'))
            {
                var text = line.TrimEnd('\r');
                if (string.IsNullOrWhiteSpace(text)) continue;
                _writer.Write(Stamp());
                _writer.Write(' ');
                _writer.Write(text);
                _writer.Write('\n');
            }
            _writer.Flush();
        }
    }

    /// <summary>回显到界面。</summary>
    public void Echo(string text) => _console(text);

    /// <summary>记一条要执行的命令：日志留完整命令行，界面也回显一份。</summary>
    public string Cmd(IEnumerable<string> args)
    {
        var list = args?.ToList() ?? new List<string>();
        var text = string.Join(' ', list.Select(Keys.QuoteArg));
        Write("CMD  " + text);
        Echo("    > " + text);
        return text;
    }

    /// <summary>记一个产出/需要的文件（路径 + 大小）。</summary>
    public void FileEntry(string tag, string path)
    {
        if (string.IsNullOrEmpty(path)) return;
        long? size = null;
        try { if (System.IO.File.Exists(path)) size = new FileInfo(path).Length; } catch { }
        Write($"FILE {tag,-6} {path} ({(size.HasValue ? size.Value + " bytes" : "MISSING")})");
    }

    /// <summary>告警：界面 + 日志。</summary>
    public void Warn(string message)
    {
        _warn(message);
        Write("WARN " + message);
    }

    /// <summary>同一类诊断只打一次，批量跑几十首歌时避免刷屏。</summary>
    public void Note(string reason)
    {
        if (!_reasons.Add(reason)) return;
        _warn("    note: " + reason);
    }

    /// <summary>探测类输出折成一行，避免日志被刷屏。</summary>
    public static string OneLine(string? s)
    {
        if (string.IsNullOrEmpty(s)) return "(none)";
        var o = string.Join(' ', s.Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries));
        if (o.Length == 0) return "(blank)";
        return o.Length > 200 ? o[..200] + "..." : o;
    }

    private static string Stamp() => DateTime.Now.ToString("[HH:mm:ss]");
}
