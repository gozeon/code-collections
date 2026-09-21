using System;
using System.IO;

namespace Rename.Models
{
    /// <summary>
    /// 左侧源文件列表中的一项。
    /// </summary>
    public class FileEntry
    {
        public string FullPath { get; init; } = string.Empty;

        public string Name { get; init; } = string.Empty;

        /// <summary>字节数，排序用。</summary>
        public long Size { get; init; }

        /// <summary>修改时间，排序用。</summary>
        public DateTime Modified { get; init; }

        public string SizeText => FormatSize(Size);

        public string ModifiedText => Modified.ToString("yyyy-MM-dd HH:mm:ss");

        public RenameItem ToRenameItem()
        {
            DateTime timestamp = Modified;
            try
            {
                DateTime created = File.GetCreationTime(FullPath);
                if (created.Year > 1601)
                {
                    timestamp = created;
                }
            }
            catch (IOException)
            {
                // 读取创建时间失败时退回修改时间。
            }
            catch (UnauthorizedAccessException)
            {
            }

            return new RenameItem(FullPath, timestamp);
        }

        private static string FormatSize(long bytes)
        {
            string[] units = { "B", "KB", "MB", "GB", "TB" };
            double value = bytes;
            int unit = 0;
            while (value >= 1024 && unit < units.Length - 1)
            {
                value /= 1024;
                unit++;
            }

            return unit == 0 ? $"{bytes} {units[unit]}" : $"{value:0.##} {units[unit]}";
        }
    }
}
