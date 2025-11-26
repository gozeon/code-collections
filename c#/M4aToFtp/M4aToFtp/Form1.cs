using FluentFTP;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace M4aToFtp
{
    public partial class Form1 : Form
    {
        private (string path, string fullPath) targetPath;
        public Form1()
        {
            InitializeComponent();
        }

        // 添加日志
        private void LogMessage(string message, string level = "INFO")
        {
            if (richTextBox1.InvokeRequired)
            {
                richTextBox1.Invoke(new Action(() => LogMessage(message, level)));
                return;
            }

            Color color = level switch
            {
                "INFO" => Color.Black,
                "WARN" => Color.Orange,
                "ERROR" => Color.Red,
                _ => Color.Black
            };

            richTextBox1.SelectionStart = richTextBox1.TextLength;
            richTextBox1.SelectionColor = color;
            richTextBox1.AppendText($"{DateTime.Now:HH:mm:ss} {message}\n");
            richTextBox1.ScrollToCaret();
        }

        public async Task<bool> UploadFile(string ftpHost, string username, string password, string remotePath, string localPath)
        {
            try
            {
                using(var client = new AsyncFtpClient(ftpHost, username, password))
                {
                    await client.AutoConnect();

                    client.Config.RetryAttempts = 3;
                    client.Config.LogToConsole = true;

                    await client.UploadFile(localPath, remotePath, FtpRemoteExists.Overwrite, true,FtpVerify.Retry, new Progress<FtpProgress>(x =>
                    {
                        LogMessage($"上传{ftpHost}: {x.Progress:F2}%");
                    }));

                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return false;
            }
        }

        private static (string path, string fullPath) MakeFTPPath(string vid, string suffix)
        {
            List<string> folders = new List<string>();

            // 每4个字符一组分割
            for (int i = 0; i < vid.Length / 4; i++)
            {
                folders.Add(vid.Substring(i * 4, 4));
            }

            // 除最后一个外的文件夹路径
            string path = string.Join("/", folders.Take(folders.Count - 1));

            // 计算权重
            int weight = 1;
            for (int i = vid.Length - 8; i < vid.Length; i++)
            {
                weight *= (vid[i] % 9) + 1;
            }

            // 混淆字符串
            StringBuilder confusedWord = new StringBuilder();
            for (int i = 1; i < vid.Length; i++)
            {
                int j = ((vid[i - 1] % 9) + i) * weight * i;
                int changedASCII = vid[i] + j;
                changedASCII %= 122;

                if (changedASCII < 65)
                {
                    changedASCII += 65;
                }
                if (changedASCII > 122)
                {
                    changedASCII = 122 - (changedASCII % 122);
                }
                if (changedASCII > 90 && changedASCII < 97)
                {
                    if (j % 2 == 0)
                        changedASCII = 90 - (changedASCII % 90);
                    else
                        changedASCII = 97 + (changedASCII % 90);
                }

                confusedWord.Append((char)changedASCII);
            }

            string fileName = $"{confusedWord}{folders.Last()}_{suffix}";
            string fullPath = $"{path}/{fileName}";

            return (path, fullPath);
        }

        private void textBox1_Leave(object sender, EventArgs e)
        {
            LogMessage($"已设置vod id: {textBox1.Text}");
            try
            {
                targetPath = MakeFTPPath(textBox1.Text, "1");

                LogMessage($"{targetPath.path}");
                LogMessage($"{targetPath.fullPath}");
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
            }
   
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (openFileDialog1.ShowDialog() == DialogResult.OK)
            {
                label3.Text = openFileDialog1.FileName;

                LogMessage($"已选择m4a文件: {openFileDialog1.FileName}");
            }
        }

        private async void button2_ClickAsync(object sender, EventArgs e)
        {
            button2.Enabled = false;
            try { 
                if (string.IsNullOrEmpty(textBox1.Text))
                {
                    MessageBox.Show("请输入VodID", "错误", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    throw new Exception("VodID 未找到");
                }

                if (string.IsNullOrEmpty(label3.Text))
                {
                    MessageBox.Show("请选择m4a文件", "错误", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    throw new Exception("M4a文件未找到");
                }

                var remotePath = $"/media/mobile/wx/{targetPath.fullPath}.m4a";
                var localPath = label3.Text;

                LogMessage("开始上传..");
                LogMessage($"服务器路径: {remotePath}");
                LogMessage($"本地路径: {localPath}");

                // 等待两个任务都完成
                bool[] results = await Task.WhenAll([
                    UploadFile("127.0.0.1", "user", "password", remotePath, localPath),
                    UploadFile("127.0.0.1", "user", "password", remotePath, localPath)
                ]);

                // 输出日志
                LogMessage($"上传(127.0.0.1)结果: {results[0]}", results[0] ? "INFO" : "ERROR");
                LogMessage($"上传(127.0.0.1)结果: {results[1]}", results[1] ? "INFO" : "ERROR");


                LogMessage("上传完成!");
            }
            catch(Exception ex)
            {
                LogMessage("上传失败");
                LogMessage(ex.ToString(), "ERROR");
            }
            finally
            {
                button2.Enabled = true;
            }
          
            return;
        }

    }

}
