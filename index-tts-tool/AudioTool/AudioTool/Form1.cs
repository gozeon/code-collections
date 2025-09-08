using NAudio.Wave;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml.Linq;
using static AudioTool.DataSet1;

namespace AudioTool
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }
        private void Form1_Load(object sender, EventArgs e)
        {
            dataSet1.DataTable1.AddDataTable1Row("909频道 新闻 男声", "909_news_man.m4a");
            dataSet1.DataTable1.AddDataTable1Row("909频道 新闻 女声", "909_news_woman.m4a");

            textBox3.Text = Properties.Settings.Default.ApiHost;
            textBox4.Text = Properties.Settings.Default.AudacityPath;
            numericUpDown1.Value = (decimal)Properties.Settings.Default.AudioGap;

            if (string.IsNullOrEmpty(Properties.Settings.Default.OutputFolder))
            {
                Properties.Settings.Default.OutputFolder = Environment.GetFolderPath(Environment.SpecialFolder.MyMusic);
                Properties.Settings.Default.Save();
            }

            initOutputFolderSetting();

            textBox5.Text = Properties.Settings.Default.OutputFolder; // UI 显示
        }

        private void initOutputFolderSetting()
        {
            // 取出设置
            string folder = Properties.Settings.Default.OutputFolder;

            // 展开环境变量
            folder = Environment.ExpandEnvironmentVariables(folder);

            // 如果目录不存在，就自动创建
            if (!Directory.Exists(folder))
            {
                try
                {
                    Directory.CreateDirectory(folder);
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"无法创建目录: {ex.Message}\n将使用我的音乐目录。");
                    folder = Environment.GetFolderPath(Environment.SpecialFolder.MyMusic);
                }
            }

            // 更新配置并保存
            Properties.Settings.Default.OutputFolder = folder;
            Properties.Settings.Default.Save();
        }

        private async void button1_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(textBox1.Text))
            {
                MessageBox.Show("请输入文本", "错误", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            try
            {
                string text = textBox1.Text;
                string refAudio = comboBox1.SelectedValue.ToString();
                var res = await TaskApiClientFactory.Create().AddTaskAsync(text, refAudio);
                var taskId = res["task_id"];

                // 插入 DataGridView
                DataTable2Row newRow = dataSet1.DataTable2.NewDataTable2Row();
                newRow.Text = text;
                newRow.RefAudio = comboBox1.Text;
                newRow.TaskId = taskId.ToString();
                newRow.TaskStatus = "doing";

                dataSet1.DataTable2.AddDataTable2Row(newRow);

                // 轮询状态
                _ = Task.Run(() => PollTaskStatus(taskId.ToString()));
            }
            catch(Exception ex)
            {
                MessageBox.Show($"添加任务失败: {ex.Message}");
            }
        }

        private async void PollTaskStatus(string taskId)
        {
            while (true)
            {
                try
                {
                    var res = await TaskApiClientFactory.Create().GetTaskStatusAsync(taskId);
                    var status = res["status"];

                    this.Invoke(new Action(() => {
                        // 更新表数据
                        var row = dataSet1.DataTable2.FirstOrDefault(r => r.TaskId == taskId);
                        if (row != null)
                        {
                            row.TaskStatus = status.ToString();
                        }
                    }));

                    // 结束循环
                    List<string> statusDoings = new List<string> { "queued", "running" };
                    if (!statusDoings.Contains(status.ToString()))
                    {
                        if (status.ToString() == "done")
                        {
                            var row = dataSet1.DataTable2.FirstOrDefault(r => r.TaskId == taskId);
                            if (row != null)
                            {
                                row.TaskStatus = "下载文件";
                            }
                            _ = Task.Run(async () => {
                                // 下载文件
                                string savePath = await TaskApiClientFactory.Create().DownloadTaskFileAsync(res["download_url"].ToString(), textBox2.Text.Trim());
                                this.Invoke(new Action(() =>
                                {
                                    // 更新表数据
                                    if (row != null)
                                    {
                                        row.TaskFile = savePath;
                                        row.TaskStatus = "完成";
                                    }
                                }));
                            });
                        }
                        break; // 任务完成就停止轮询
                    }

                }
                catch(Exception ex)
                {
                    MessageBox.Show($"轮询任务 {taskId} 失败: {ex.Message}");
                    break;
                }

                await Task.Delay(3000); // 每隔 3 秒检查一次
            }
        }

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0 && e.ColumnIndex == dataGridView1.Columns["taskFileDataGridViewTextBoxColumn"].Index)
            {
                string filepath = dataGridView1.Rows[e.RowIndex].Cells["taskFileDataGridViewTextBoxColumn"].Value?.ToString();
                if (!string.IsNullOrEmpty(filepath) && File.Exists(filepath))
                {
                    System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                    {
                        FileName = filepath,
                        UseShellExecute = true
                    });
                }
            }
        }

        private void button2_Click(object sender, EventArgs e)
        {
            // 获取data选中文件
            List<string> files = GetSelectedRowFiles();
            // 使用Audacity打开
            OpenFilesInAudacity(files);
        }

        private async void OpenFilesInAudacity(List<string> files)
        {
            if (files.Count == 0)
            {
                MessageBox.Show("请先选择至少一个音频文件。");
                return;
            }

            string audacityPath = Properties.Settings.Default.AudacityPath;
            if (string.IsNullOrEmpty(audacityPath) || !File.Exists(audacityPath))
            {
                MessageBox.Show("请先配置 Audacity 路径！");
                return;
            }

            // 生成一个lof文件
            string args = await GenTempLofFileAsync(files);

            System.Diagnostics.Process.Start(audacityPath, args);
        }

        // https://manual.audacityteam.org/man/lof_files.html
        private async Task<string> GenTempLofFileAsync(List<string> files)
        {
            string appname = Assembly.GetExecutingAssembly().GetName().Name;
            string fileName = Path.GetRandomFileName() + ".lof";
            string filePath = Path.Combine(Path.GetTempPath(), appname, fileName);
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));

            // 获取音频文件时长
            List<TimeSpan> durations = await new AudioProcess().GetAudioDurationsAsync(files);

            // 写入文件
            using (StreamWriter writer = new StreamWriter(filePath))
            {

                TimeSpan cumulativeOffset = TimeSpan.Zero;
                TimeSpan gap = TimeSpan.FromMilliseconds(Properties.Settings.Default.AudioGap);

                writer.WriteLine("window");
                for (int i = 0; i < files.Count; i++)
                {
                    if (i == 0)
                    {
                        writer.WriteLine($"file \"{files[i]}\"");
                    } 
                    else
                    {
                        writer.WriteLine($"file \"{files[i]}\" offset {cumulativeOffset.TotalSeconds:F3}");
                    }

                    cumulativeOffset += durations[i] + gap;
                }
            }
            return filePath;
        }

        private List<string> GetSelectedRowFiles()
        {
            return dataGridView1.SelectedRows
                .Cast<DataGridViewRow>()
                .OrderBy(r => r.Index)
                .Select(r => r.Cells["taskFileDataGridViewTextBoxColumn"].Value.ToString())
                .Where(path => (!string.IsNullOrEmpty(path) && File.Exists(path)))
                .ToList();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            if(openFileDialog1.ShowDialog() == DialogResult.OK)
            {
                textBox4.Text = openFileDialog1.FileName;

                // 保存设置
                Properties.Settings.Default.AudacityPath = openFileDialog1.FileName;
                Properties.Settings.Default.Save();
            }

        }

        private void button4_Click(object sender, EventArgs e)
        {
            Properties.Settings.Default.ApiHost = textBox3.Text;
            Properties.Settings.Default.AudacityPath = textBox4.Text;
            Properties.Settings.Default.AudioGap = (double)numericUpDown1.Value;
            Properties.Settings.Default.OutputFolder = textBox5.Text;
            Properties.Settings.Default.Save();
            MessageBox.Show("配置已保存");
        }

        private void button5_Click(object sender, EventArgs e)
        {
            saveFileDialog1.InitialDirectory = Properties.Settings.Default.OutputFolder;
            if (saveFileDialog1.ShowDialog() == DialogResult.OK)
            {
                // 获取data选中文件
                List<string> files = GetSelectedRowFiles();
                TimeSpan gap = TimeSpan.FromMilliseconds(Properties.Settings.Default.AudioGap);

                new AudioProcess().MergeAudioFiles(files, saveFileDialog1.FileName, gap);
                return;
            }
        }

        private void button6_Click(object sender, EventArgs e)
        {
            if(folderBrowserDialog1.ShowDialog() == DialogResult.OK)
            {
                textBox5.Text = folderBrowserDialog1.SelectedPath;

                // 保存设置
                Properties.Settings.Default.AudacityPath = folderBrowserDialog1.SelectedPath;
                Properties.Settings.Default.Save();
            }
        }

        private void button7_Click(object sender, EventArgs e)
        {
            var dgv = dataGridView1;
            var bs = bindingSource2;

            if (dgv.SelectedRows.Count > 0)
            {
                int selectedIndex = bs.Position; // Get the current position in the BindingSource
                if (selectedIndex > 0) // Cannot move up if it's the first row
                {
                    DataRow rowToMove = ((DataRowView)bs.Current).Row; // Get the DataRow
                    DataRow newPositionRow = ((DataRowView)bs[selectedIndex - 1]).Row; // Get the row above

                    // Get the original values of the row above
                    object[] originalValues = newPositionRow.ItemArray;

                    // Copy the values of the row to move into the position above
                    newPositionRow.ItemArray = rowToMove.ItemArray;

                    // Copy the original values of the row above into the row's original position
                    rowToMove.ItemArray = originalValues;

                    bs.Position = selectedIndex - 1; // Update the BindingSource position

                    dgv.Rows[selectedIndex - 1].Selected = true;
                }
            }
        }

        private void button8_Click(object sender, EventArgs e)
        {
            var dgv = dataGridView1;
            var bs = bindingSource2;

            if (dgv.SelectedRows.Count > 0)
            {
                int selectedIndex = bs.Position;
                if (selectedIndex < bs.Count - 1) // Cannot move down if it's the last row
                {
                    DataRow rowToMove = ((DataRowView)bs.Current).Row;
                    DataRow newPositionRow = ((DataRowView)bs[selectedIndex + 1]).Row;

                    object[] originalValues = newPositionRow.ItemArray;

                    newPositionRow.ItemArray = rowToMove.ItemArray;
                    rowToMove.ItemArray = originalValues;

                    bs.Position = selectedIndex + 1;

                    dgv.Rows[selectedIndex + 1].Selected = true;
                }
            }
        }

    }
}
