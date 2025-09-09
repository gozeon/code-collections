using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace AudioTool
{
    public static class TaskApiClientFactory
    {
        internal static TaskApiClient Create()
        {
            return new TaskApiClient(Properties.Settings.Default.ApiHost);
        }
    }
    internal class TaskApiClient
    {
        private readonly string _baseUrl;
        private readonly HttpClient _client;
        public TaskApiClient(string baseUrl)
        {
            _baseUrl = baseUrl.TrimEnd('/');
            _client = new HttpClient();
        }

        /// <summary>
        /// 添加任务
        /// </summary>
        public async Task<Dictionary<string, object>> AddTaskAsync(string text, string refAudio)
        {
            var data = new { text = text, ref_video = refAudio };
            string json = JsonConvert.SerializeObject(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await _client.PostAsync($"{_baseUrl}/start/task", content);
            response.EnsureSuccessStatusCode();

            string result = await response.Content.ReadAsStringAsync();
            var taskResponse = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

            return taskResponse;
        }

        /// <summary>
        /// 轮询任务状态
        /// </summary>
        public async Task<Dictionary<string, object>> GetTaskStatusAsync(string taskId)
        {
            HttpResponseMessage response = await _client.GetAsync($"{_baseUrl}/status/{taskId}");
            response.EnsureSuccessStatusCode();

            string result = await response.Content.ReadAsStringAsync();
            var statusResponse = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);
            return statusResponse;
        }

        /// <summary>
        /// 下载任务生成的文件
        /// </summary>
        public async Task<string> DownloadTaskFileAsync(string download_url, string savename)
        {
            HttpResponseMessage response = await _client.GetAsync($"{_baseUrl}/{download_url.TrimStart('/')}");
            response.EnsureSuccessStatusCode();

            // 配置目录
            string outputFolder = Properties.Settings.Default.OutputFolder;

            string filename = Path.GetFileName(download_url);
            if (!string.IsNullOrEmpty(savename))
            {
                filename = savename + Path.GetExtension(download_url);
            }
            string savePath = Path.Combine(outputFolder, filename);

            // 如果文件存在就+1
            int count = 1;
            while (File.Exists(savePath))
            {
                string fileNameWithoutExt = Path.GetFileNameWithoutExtension(filename);
                string ext = Path.GetExtension(filename);
                savePath = Path.Combine(outputFolder, $"{fileNameWithoutExt}({count}){ext}");
                count++;
            }

            using (var fs = new FileStream(savePath, FileMode.Create, FileAccess.Write, FileShare.None))
            {
                await response.Content.CopyToAsync(fs);
            }

            return savePath;
        }

        /// <summary>
        /// 获取参考视频
        /// </summary>
        public async Task<JArray> GetRefAudiosAsync()
        {
            HttpResponseMessage response = await _client.GetAsync($"{_baseUrl}/ref-videos");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var res = JsonConvert.DeserializeObject<JArray>(json);
            return res;
        }
    }
}
