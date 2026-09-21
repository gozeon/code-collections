using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Input;
using System.Windows.Media;
using Microsoft.Win32;
using Rename.Models;
using Rename.Services;
using Path = System.IO.Path;

namespace Rename
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private readonly ObservableCollection<FileEntry> _sourceFiles = new();
        private readonly ObservableCollection<RenameItem> _renameItems = new();

        private string _currentFolder = string.Empty;
        private string _filterPattern = "*";
        private bool _isBusy;

        private static readonly object FolderPlaceholder = new();

        private ListView? _sortedList;
        private string? _sortedProperty;
        private bool _sortAscending = true;

        public MainWindow()
        {
            InitializeComponent();

            SourceFileList.ItemsSource = _sourceFiles;
            RenameList.ItemsSource = _renameItems;

            SourceFileList.AddHandler(GridViewColumnHeader.ClickEvent, new RoutedEventHandler(List_HeaderClick));
            RenameList.AddHandler(GridViewColumnHeader.ClickEvent, new RoutedEventHandler(List_HeaderClick));

            LoadNamingPresets();
            LoadDrives();
            RefreshPreview();
        }

        /// <summary>常用命名规则：显示名称 -> 模板。</summary>
        private static readonly (string Label, string Template)[] NamingPresets =
        {
            ("原名 + 序号", "*_#####"),
            ("序号", "#####"),
            ("文件夹名 + 序号", "$P_#####"),
            ("日期 + 序号", "$Y$M$D_#####"),
            ("原名 + 日期", "*_$Y$M$D"),
            ("原名（保持不变）", "*"),
        };

        private bool _initializingPresets;

        private void LoadNamingPresets()
        {
            foreach ((string label, string template) in NamingPresets)
            {
                PresetComboBox.Items.Add(new ComboBoxItem { Content = label, Tag = template });
            }

            // 默认选中与初始模板一致的规则，但不覆盖“就绪”状态。
            _initializingPresets = true;
            try
            {
                PresetComboBox.SelectedIndex = 0;
            }
            finally
            {
                _initializingPresets = false;
            }
        }

        private void PresetComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (PresetComboBox.SelectedItem is ComboBoxItem { Tag: string template } item)
            {
                // 赋值会触发 TemplateTextBox_TextChanged，从而刷新预览。
                TemplateTextBox.Text = template;

                if (!_initializingPresets)
                {
                    StatusText.Text = $"已套用命名规则：{item.Content}";
                }
            }
        }

        #region 目录树

        private void LoadDrives()
        {
            FolderTree.Items.Clear();

            foreach (DriveInfo drive in DriveInfo.GetDrives())
            {
                try
                {
                    if (!drive.IsReady)
                    {
                        continue;
                    }

                    FolderTree.Items.Add(CreateFolderNode(drive.RootDirectory.FullName, drive.Name));
                }
                catch (IOException)
                {
                    // 单个驱动器不可用时跳过。
                }
                catch (UnauthorizedAccessException)
                {
                }
            }
        }

        private TreeViewItem CreateFolderNode(string path, string header)
        {
            var node = new TreeViewItem
            {
                Header = string.IsNullOrWhiteSpace(header) ? path : header,
                Tag = path,
            };

            // 占位子节点，展开时再真正加载，避免一次性遍历整棵磁盘。
            node.Items.Add(FolderPlaceholder);
            node.Expanded += FolderNode_Expanded;
            return node;
        }

        private void FolderNode_Expanded(object sender, RoutedEventArgs e)
        {
            var node = (TreeViewItem)sender;
            if (node.Items.Count != 1 || !ReferenceEquals(node.Items[0], FolderPlaceholder))
            {
                return;
            }

            PopulateFolderNode(node);
        }

        /// <summary>（重新）读取某个目录节点的子文件夹，用于首次展开或手动刷新。</summary>
        private void PopulateFolderNode(TreeViewItem node)
        {
            node.Items.Clear();

            if (node.Tag is not string path || !Directory.Exists(path))
            {
                node.Items.Add(FolderPlaceholder);
                return;
            }

            foreach (string directory in GetDirectories(path))
            {
                string header = Path.GetFileName(directory);
                if (string.IsNullOrEmpty(header))
                {
                    header = directory;
                }

                node.Items.Add(CreateFolderNode(directory, header));
            }
        }

        private static IEnumerable<string> GetDirectories(string path)
        {
            try
            {
                return Directory.EnumerateDirectories(path)
                    .OrderBy(d => Path.GetFileName(d), StringComparer.OrdinalIgnoreCase)
                    .ToList();
            }
            catch (Exception ex) when (ex is UnauthorizedAccessException or IOException or ArgumentException)
            {
                return Array.Empty<string>();
            }
        }

        private void FolderTree_SelectedItemChanged(object sender, RoutedPropertyChangedEventArgs<object> e)
        {
            if (e.NewValue is TreeViewItem node && node.Tag is string path)
            {
                SetCurrentFolder(path);
            }
        }

        private void SetCurrentFolder(string path)
        {
            if (string.IsNullOrWhiteSpace(path) || !Directory.Exists(path))
            {
                return;
            }

            _currentFolder = path;
            CurrentPathTextBox.Text = path;
            LoadSourceFiles();
        }

        private void BrowseButton_Click(object sender, RoutedEventArgs e)
        {
            var dialog = new OpenFolderDialog
            {
                Title = "选择目标目录",
                InitialDirectory = Directory.Exists(_currentFolder) ? _currentFolder : string.Empty,
            };

            if (dialog.ShowDialog(this) == true)
            {
                SetCurrentFolder(dialog.FolderName);
            }
        }

        private void RefreshButton_Click(object sender, RoutedEventArgs e)
        {
            RefreshCurrentFolder();
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.F5)
            {
                RefreshCurrentFolder();
                e.Handled = true;
            }
        }

        /// <summary>重新读取当前选中目录：先刷新目录树节点，再重新加载文件列表。</summary>
        private void RefreshCurrentFolder()
        {
            if (_isBusy)
            {
                return;
            }

            if (FolderTree.SelectedItem is TreeViewItem node && node.Tag is string path && Directory.Exists(path))
            {
                PopulateFolderNode(node);
            }

            if (Directory.Exists(_currentFolder))
            {
                LoadSourceFiles();
            }
            else
            {
                _sourceFiles.Clear();
                StatusText.Text = "请选择目录";
            }
        }

        private void CurrentPathTextBox_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                SetCurrentFolder(CurrentPathTextBox.Text.Trim());
            }
        }

        private void IncludeSubFolders_Changed(object sender, RoutedEventArgs e)
        {
            LoadSourceFiles();
        }

        private void FilterTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            string text = FilterTextBox.Text.Trim();
            _filterPattern = string.IsNullOrEmpty(text) ? "*" : text;

            if (IsLoaded)
            {
                LoadSourceFiles();
            }
        }

        #endregion

        #region 源文件列表

        private void LoadSourceFiles()
        {
            _sourceFiles.Clear();

            if (!Directory.Exists(_currentFolder))
            {
                StatusText.Text = "请选择目录";
                return;
            }

            SearchOption option = IncludeSubFoldersCheckBox.IsChecked == true
                ? SearchOption.AllDirectories
                : SearchOption.TopDirectoryOnly;

            try
            {
                foreach (string file in Directory.EnumerateFiles(_currentFolder, _filterPattern, option))
                {
                    var info = new FileInfo(file);
                    _sourceFiles.Add(new FileEntry
                    {
                        FullPath = file,
                        Name = info.Name,
                        Size = info.Length,
                        Modified = info.LastWriteTime,
                    });
                }

                ApplySort(SourceFileList, "Name", ascending: true, remember: false);
                StatusText.Text = $"已加载 {_sourceFiles.Count} 个文件";
            }
            catch (Exception ex)
            {
                StatusText.Text = "读取目录失败: " + ex.Message;
            }
        }

        private void SourceFileList_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            AddItems(SourceFileList.SelectedItems.Cast<FileEntry>());
        }

        #endregion

        #region 添加 / 移除

        private void AddSelectedButton_Click(object sender, RoutedEventArgs e)
        {
            AddItems(SourceFileList.SelectedItems.Cast<FileEntry>());
        }

        private void AddAllButton_Click(object sender, RoutedEventArgs e)
        {
            AddItems(_sourceFiles);
        }

        private void AddItems(IEnumerable<FileEntry> entries)
        {
            if (_isBusy)
            {
                return;
            }

            var existing = new HashSet<string>(_renameItems.Select(i => i.SourcePath), StringComparer.OrdinalIgnoreCase);
            int added = 0;

            foreach (FileEntry entry in entries)
            {
                if (existing.Add(entry.FullPath))
                {
                    _renameItems.Add(entry.ToRenameItem());
                    added++;
                }
            }

            if (added > 0)
            {
                RefreshPreview();
                StatusText.Text = $"已添加 {added} 个文件，共 {_renameItems.Count} 个待重命名";
            }
        }

        private void RemoveSelectedButton_Click(object sender, RoutedEventArgs e)
        {
            if (_isBusy)
            {
                return;
            }

            var selected = RenameList.SelectedItems.Cast<RenameItem>().ToList();
            foreach (RenameItem item in selected)
            {
                _renameItems.Remove(item);
            }

            RefreshPreview();
            StatusText.Text = $"已移除 {selected.Count} 个文件，剩余 {_renameItems.Count} 个";
        }

        private void ClearButton_Click(object sender, RoutedEventArgs e)
        {
            if (_isBusy)
            {
                return;
            }

            _renameItems.Clear();
            RefreshPreview();
            StatusText.Text = "列表已清空";
        }

        #endregion

        #region 排序

        // 每个列表的列顺序 -> 排序属性名（GridViewColumn 没有 Tag，按列索引映射）。
        private static readonly string[] SourceSortKeys = { "Name", "Size", "Modified" };
        private static readonly string[] RenameSortKeys = { "FileName", "NewName", "Status", "DirectoryName" };

        private void List_HeaderClick(object sender, RoutedEventArgs e)
        {
            if (sender is not ListView listView)
            {
                return;
            }

            GridViewColumnHeader? header = FindHeader(e.OriginalSource as DependencyObject);
            if (header?.Column is null)
            {
                return;
            }

            int index = ((GridView)listView.View).Columns.IndexOf(header.Column);
            
            string[] keys = ReferenceEquals(listView, SourceFileList) ? SourceSortKeys : RenameSortKeys;
            if (index < 0 || index >= keys.Length)
            {
                return;
            }

            string property = keys[index];

            bool ascending = true;
            if (ReferenceEquals(_sortedList, listView) && string.Equals(_sortedProperty, property, StringComparison.Ordinal))
            {
                ascending = !_sortAscending;
            }

            _sortedList = listView;
            _sortedProperty = property;
            _sortAscending = ascending;

            ApplySort(listView, property, ascending, remember: true);
        }

        private static GridViewColumnHeader? FindHeader(DependencyObject? source)
        {
            DependencyObject? current = source;
            while (current is not null and not GridViewColumnHeader)
            {
                current = VisualTreeHelper.GetParent(current);
            }

            return current as GridViewColumnHeader;
        }

        private void ApplySort(ListView listView, string property, bool ascending, bool remember)
        {
            ICollectionView view = CollectionViewSource.GetDefaultView(listView.ItemsSource);
            view.SortDescriptions.Clear();
            view.SortDescriptions.Add(new SortDescription(
                property,
                ascending ? ListSortDirection.Ascending : ListSortDirection.Descending));

            if (view is ListCollectionView listCollectionView)
            {
                listCollectionView.CustomSort = null;
            }

            if (remember && ReferenceEquals(listView, RenameList))
            {
                // 列表顺序变了，编号要跟着重排。
                RefreshPreview();
            }
        }

        #endregion

        #region 模板与预览

        private void TemplateTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            RefreshPreview();
        }

        /// <summary>扩展名大小写选项变化时刷新预览。</summary>
        private void ExtensionCaseComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            RefreshPreview();
        }

        /// <summary>按下拉框选择调整扩展名大小写：0 不改变，1 大写，2 小写。</summary>
        private string ApplyExtensionCase(string extension)
        {
            return ExtensionCaseComboBox.SelectedIndex switch
            {
                1 => extension.ToUpperInvariant(),
                2 => extension.ToLowerInvariant(),
                _ => extension,
            };
        }

        private void RefreshPreview()
        {
            if (_isBusy || RenameList.ItemsSource is null)
            {
                return;
            }

            string template = string.IsNullOrWhiteSpace(TemplateTextBox.Text) ? "*" : TemplateTextBox.Text;
            List<RenameItem> ordered = GetDisplayedItems();

            for (int i = 0; i < ordered.Count; i++)
            {
                RenameItem item = ordered[i];
                string directory = item.DirectoryName;
                string parent = Path.GetFileName(directory.TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar));
                if (string.IsNullOrEmpty(parent))
                {
                    parent = directory;
                }

                string baseName = TemplateEngine.Resolve(
                    template,
                    Path.GetFileNameWithoutExtension(item.FileName),
                    parent,
                    item.Timestamp,
                    i + 1);

                item.NewName = baseName + ApplyExtensionCase(Path.GetExtension(item.FileName));
                item.Status = "待处理";
            }

            if (ordered.Count == 0)
            {
                PreviewTextBlock.Text = "预览：暂无待重命名文件";
                return;
            }

            RenameItem first = ordered[0];
            PreviewTextBlock.Text = $"预览：{first.FileName}  →  {first.NewName}    （共 {ordered.Count} 个文件）";
        }

        /// <summary>按界面当前显示顺序取列表项（排序后编号也随之变化）。</summary>
        private List<RenameItem> GetDisplayedItems()
        {
            ICollectionView view = CollectionViewSource.GetDefaultView(RenameList.ItemsSource);
            return view.Cast<RenameItem>().ToList();
        }

        #endregion

        #region 执行重命名

        private async void StartButton_Click(object sender, RoutedEventArgs e)
        {
            if (_isBusy)
            {
                return;
            }

            if (_renameItems.Count == 0)
            {
                MessageBox.Show(this, "请先添加要重命名的文件。", "批量重命名", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            RefreshPreview();

            if (!Validate(out string message))
            {
                MessageBox.Show(this, message, "无法开始", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            MessageBoxResult confirm = MessageBox.Show(
                this,
                $"即将重命名 {_renameItems.Count} 个文件，是否继续？",
                "批量重命名",
                MessageBoxButton.OKCancel,
                MessageBoxImage.Question);

            if (confirm != MessageBoxResult.OK)
            {
                return;
            }

            List<RenameItem> items = _renameItems.ToList();
            int total = items.Count;

            _isBusy = true;
            SetBusyState(true);
            RenameProgress.Maximum = total;
            RenameProgress.Value = 0;
            StatusText.Text = $"正在重命名 0/{total} ...";

            var progress = new Progress<RenameProgressInfo>(info =>
            {
                info.Item.Status = info.Status;
                RenameProgress.Value = info.Completed;
                StatusText.Text = $"正在重命名 {info.Completed}/{total} ...";
            });

            RenameResult result;
            try
            {
                result = await Task.Run(() => FileRenamer.Rename(items, progress));
            }
            catch (Exception ex)
            {
                StatusText.Text = "重命名失败: " + ex.Message;
                SetBusyState(false);
                _isBusy = false;
                return;
            }

            RenameProgress.Value = total;
            StatusText.Text = $"完成：成功 {result.Success} 个，失败 {result.Failed} 个";
            SetBusyState(false);
            _isBusy = false;

            MessageBox.Show(
                this,
                $"重命名完成。\n成功 {result.Success} 个，失败 {result.Failed} 个。",
                "批量重命名",
                MessageBoxButton.OK,
                result.Failed == 0 ? MessageBoxImage.Information : MessageBoxImage.Warning);

            // 已成功处理的项从列表移除；失败项保留，方便修正后重试。
            List<RenameItem> done = items
                .Where(i => i.Status is "成功" or "跳过（名称未变）")
                .ToList();
            foreach (RenameItem item in done)
            {
                _renameItems.Remove(item);
            }

            RefreshPreview();
            LoadSourceFiles();
        }

        /// <summary>检查目标名是否重复或已存在（正在重命名的源文件除外）。</summary>
        private bool Validate(out string message)
        {
            var duplicates = _renameItems
                .GroupBy(
                    i => (Dir: i.DirectoryName, Name: i.NewName),
                    new TargetComparer())
                .Where(g => g.Count() > 1)
                .Select(g => g.First().NewName)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            if (duplicates.Count > 0)
            {
                message = "以下目标名称重复，请调整模板或列表：\n" + string.Join("\n", duplicates.Take(10));
                return false;
            }

            var sources = new HashSet<string>(_renameItems.Select(i => i.SourcePath), StringComparer.OrdinalIgnoreCase);
            var conflicts = new List<string>();

            foreach (RenameItem item in _renameItems)
            {
                string target = Path.Combine(item.DirectoryName, item.NewName);
                if (sources.Contains(target))
                {
                    // 目标是本次参与重命名的文件，两阶段重命名可以处理。
                    continue;
                }

                if (File.Exists(target))
                {
                    conflicts.Add(item.NewName);
                }
            }

            if (conflicts.Count > 0)
            {
                message = "以下目标文件已存在，请调整模板或列表：\n" + string.Join("\n", conflicts.Distinct().Take(10));
                return false;
            }

            message = string.Empty;
            return true;
        }

        private sealed class TargetComparer : IEqualityComparer<(string Dir, string Name)>
        {
            public bool Equals((string Dir, string Name) x, (string Dir, string Name) y)
            {
                return string.Equals(x.Dir, y.Dir, StringComparison.OrdinalIgnoreCase)
                    && string.Equals(x.Name, y.Name, StringComparison.OrdinalIgnoreCase);
            }

            public int GetHashCode((string Dir, string Name) obj)
            {
                return HashCode.Combine(
                    obj.Dir?.ToUpperInvariant(),
                    obj.Name?.ToUpperInvariant());
            }
        }

        private void SetBusyState(bool busy)
        {
            BrowseButton.IsEnabled = !busy;
            RefreshButton.IsEnabled = !busy;
            AddSelectedButton.IsEnabled = !busy;
            AddAllButton.IsEnabled = !busy;
            RemoveSelectedButton.IsEnabled = !busy;
            ClearButton.IsEnabled = !busy;
            StartButton.IsEnabled = !busy;
            StartButton.Content = busy ? "处理中..." : "开始";
        }

        #endregion
    }
}
