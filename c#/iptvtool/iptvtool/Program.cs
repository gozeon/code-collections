using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Windows.Forms;

namespace iptvtool
{
    internal static class Program
    {
        /// <summary>
        /// 应用程序的主入口点。
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new TrayApplictionContext());
        }
    }

    internal class TrayApplictionContext : ApplicationContext
    {
        private NotifyIcon notifyIcon;
        public TrayApplictionContext()
        {
            notifyIcon = new NotifyIcon()
            {
                Icon = Properties.Resources.icon,
                Visible = true,
                Text = "iptv tool"
            };

            var menu = new ContextMenuStrip();

            menu.Items.Add("CHOKIDAR_USEPOLLING", null, (s, e) => CopyToClipboard("export CHOKIDAR_USEPOLLING=true"));
            menu.Items.Add("alpine go build", null, (s, e) => CopyToClipboard("CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build"));

            menu.Items.Add(new ToolStripSeparator());

            var shopMenu = new ToolStripMenuItem("group");
            shopMenu.DropDownItems.Add("github", null, (s, e) => OpenHttpUrl("https://github.com/gozeon/cheatsheets"));
            menu.Items.Add(shopMenu);

            menu.Items.Add(new ToolStripSeparator());
            menu.Items.Add("退出", null, ExitApp);

            notifyIcon.ContextMenuStrip = menu;

            notifyIcon.MouseClick += NotifyIcon_MouseClick;
        }

        private void NotifyIcon_MouseClick(object sender, MouseEventArgs e)
        {
            if(e.Button == MouseButtons.Left)
            {
                // https://blog.csdn.net/nanbaifeiliao/article/details/7729361
                Type t = typeof(NotifyIcon);
                MethodInfo mi = t.GetMethod("ShowContextMenu", BindingFlags.NonPublic | BindingFlags.Instance);
                mi.Invoke(notifyIcon, null);
                //if(notifyIcon.ContextMenuStrip != null)
                //{
                //    notifyIcon.ContextMenuStrip.Show(Cursor.Position);
                //}
            }
        }

        private void ShowMessage(object sender, EventArgs e)
        {
            notifyIcon.ShowBalloonTip(3000, "xtool", "no", ToolTipIcon.Info);
        }

        private void ExitApp(object sender, EventArgs e)
        {
            notifyIcon.Visible = false;
            notifyIcon.Dispose();
            Application.Exit();
        }

        private void CopyToClipboard(string text)
        {
            Clipboard.SetText(text);
            notifyIcon.ShowBalloonTip(2000, "提示", $"已复制: {text}", ToolTipIcon.Info);
        }

        private void OpenFilePath(string path)
        {
            if (Directory.Exists(path) || File.Exists(path))
            {
                Process.Start("explorer.exe", path);
            }
            else
            {
                notifyIcon.ShowBalloonTip(2000, "错误", $"路径不存在: {path}", ToolTipIcon.Error);
            }
        }

        private void OpenHttpUrl(string url)
        {
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                notifyIcon.ShowBalloonTip(2000, "错误", $"无法打开URL: {ex.Message}", ToolTipIcon.Error);
            }
        }

        private void OpenCmdWithEnv(string key, string value)
        {
            string arguments = $"/k set {key}={value}";

            var psi = new ProcessStartInfo("cmd.exe", arguments)
            {
                UseShellExecute = true, // 这里必须 true 才能显示窗口
                WorkingDirectory = @"C:\Users\admin"
            };

            Process.Start(psi);
        }

        private void RunFile(string filePath, string exe, string argsPrefix)
        {
            if (System.IO.File.Exists(filePath))
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = exe,
                    Arguments = $"{argsPrefix} \"{filePath}\"",
                    UseShellExecute = true
                });
            }
            else
            {
                MessageBox.Show($"文件不存在: {filePath}", "错误", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
        
        private void RunEmulator()
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = @"D:\androdsdk\emulator\emulator.exe",
                Arguments = "-avd Small_Phone",
                UseShellExecute = true
            });
        }
    }
}

