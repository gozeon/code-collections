using System;
using System.Collections.Generic;
using System.IO;
using Rename.Models;

namespace Rename.Services
{
    /// <summary>重命名过程中的单步进度。</summary>
    public record RenameProgressInfo(RenameItem Item, string Status, int Completed);

    /// <summary>重命名结果统计。</summary>
    public record RenameResult(int Success, int Failed);

    /// <summary>
    /// 批量重命名执行器。分两阶段进行：先把源文件改成临时名，再改成目标名，
    /// 这样可以安全处理“互换名称”这类会互相占用目标名的情况。
    /// </summary>
    public static class FileRenamer
    {
        public static RenameResult Rename(IReadOnlyList<RenameItem> items, IProgress<RenameProgressInfo>? progress)
        {
            int success = 0;
            int failed = 0;
            int completed = 0;

            var planned = new List<(RenameItem Item, string Target, string? Temp)>();

            // 第一阶段：源文件 -> 临时名
            foreach (RenameItem item in items)
            {
                string directory = item.DirectoryName;
                string target = Path.Combine(directory, item.NewName);

                if (string.Equals(item.SourcePath, target, StringComparison.OrdinalIgnoreCase))
                {
                    planned.Add((item, target, null));
                    continue;
                }

                string temp = Path.Combine(directory, "~rn_" + Guid.NewGuid().ToString("N") + Path.GetExtension(item.SourcePath));
                try
                {
                    File.Move(item.SourcePath, temp);
                    planned.Add((item, target, temp));
                }
                catch (Exception ex)
                {
                    failed++;
                    completed++;
                    progress?.Report(new RenameProgressInfo(item, "失败: " + ex.Message, completed));
                }
            }

            // 第二阶段：临时名 -> 目标名
            foreach ((RenameItem item, string target, string? temp) in planned)
            {
                if (temp is null)
                {
                    success++;
                    completed++;
                    progress?.Report(new RenameProgressInfo(item, "跳过（名称未变）", completed));
                    continue;
                }

                try
                {
                    File.Move(temp, target);
                    success++;
                    completed++;
                    progress?.Report(new RenameProgressInfo(item, "成功", completed));
                }
                catch (Exception ex)
                {
                    failed++;
                    completed++;
                    progress?.Report(new RenameProgressInfo(item, "失败: " + ex.Message, completed));

                    // 第二阶段失败时尽量还原为原文件名。
                    try
                    {
                        if (File.Exists(temp))
                        {
                            File.Move(temp, item.SourcePath);
                        }
                    }
                    catch (Exception)
                    {
                        // 还原失败只能保留临时文件，忽略。
                    }
                }
            }

            return new RenameResult(success, failed);
        }
    }
}
