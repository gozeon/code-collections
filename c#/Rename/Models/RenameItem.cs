using System;
using System.ComponentModel;
using System.IO;
using System.Runtime.CompilerServices;
using Path = System.IO.Path;

namespace Rename.Models
{
    /// <summary>
    /// 待重命名列表中一项。
    /// </summary>
    public class RenameItem : INotifyPropertyChanged
    {
        private string _newName;
        private string _status;

        public RenameItem(string sourcePath, DateTime timestamp)
        {
            SourcePath = sourcePath;
            Timestamp = timestamp;
            _newName = Path.GetFileName(sourcePath);
            _status = "待处理";
        }

        /// <summary>源文件完整路径。</summary>
        public string SourcePath { get; }

        /// <summary>用于 <c>$Y</c>/<c>$M</c>/<c>$D</c>/<c>$H</c>/<c>$N</c>/<c>$S</c> 的时间。</summary>
        public DateTime Timestamp { get; }

        /// <summary>原文件名（含扩展名）。</summary>
        public string FileName => Path.GetFileName(SourcePath);

        /// <summary>所在目录。</summary>
        public string DirectoryName => Path.GetDirectoryName(SourcePath) ?? string.Empty;

        /// <summary>重命名后的文件名（含扩展名）。</summary>
        public string NewName
        {
            get => _newName;
            set
            {
                if (_newName == value)
                {
                    return;
                }

                _newName = value;
                OnPropertyChanged();
            }
        }

        /// <summary>处理状态。</summary>
        public string Status
        {
            get => _status;
            set
            {
                if (_status == value)
                {
                    return;
                }

                _status = value;
                OnPropertyChanged();
            }
        }

        public event PropertyChangedEventHandler? PropertyChanged;

        private void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
