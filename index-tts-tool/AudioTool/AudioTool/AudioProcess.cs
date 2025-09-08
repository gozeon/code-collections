using NAudio.Wave;
using NAudio.Wave.SampleProviders;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;

namespace AudioTool
{
    internal class AudioProcess
    {

        public async Task<TimeSpan> GetAudioDurationAsync(string file)
        {
            return await Task.Run(() => { 
                using(var reader = new AudioFileReader(file))
                {
                    return reader.TotalTime;
                }
            });
        }

        public async Task<List<TimeSpan>> GetAudioDurationsAsync(List<string> files)
        {
            var tasks = new List<Task<TimeSpan>>();

            foreach (var file in files)
            {
                tasks.Add(GetAudioDurationAsync(file));
            }

            var durations = await Task.WhenAll(tasks);
            return new List<TimeSpan>(durations);
        }

        public void MergeAudioFiles(List<string> files, string outputPath, TimeSpan gap)
        {
            if (files.Count == 0) return;

            // 使用第一个文件的格式初始化 WaveFileWriter
            using (var reader0 = new AudioFileReader(files[0]))
            using (var waveFileWriter = new WaveFileWriter(outputPath, reader0.WaveFormat))
            {
                // 写入第一个文件
                WriteReaderToWriter(reader0, waveFileWriter);

                // 写入间隔
                WriteSilence(waveFileWriter, reader0.WaveFormat, gap);

                // 后续文件
                for (int i = 1; i < files.Count; i++)
                {
                    using (var reader = new AudioFileReader(files[i]))
                    {
                        // 检查格式是否一致
                        if (!reader.WaveFormat.Equals(waveFileWriter.WaveFormat))
                            throw new InvalidOperationException("音频格式不一致！请统一采样率和通道。");

                        WriteReaderToWriter(reader, waveFileWriter);
                        WriteSilence(waveFileWriter, reader.WaveFormat, gap);
                    }
                }
            }
        }

        private void WriteReaderToWriter(AudioFileReader reader, WaveFileWriter writer)
        {
            float[] buffer = new float[reader.WaveFormat.SampleRate * reader.WaveFormat.Channels];
            int read;
            while ((read = reader.Read(buffer, 0, buffer.Length)) > 0)
            {
                writer.WriteSamples(buffer, 0, read);
            }
        }

        private void WriteSilence(WaveFileWriter writer, WaveFormat format, TimeSpan gap)
        {
            int gapSamples = (int)(format.SampleRate * gap.TotalSeconds) * format.Channels;
            float[] silence = new float[gapSamples];
            writer.WriteSamples(silence, 0, silence.Length);
        }
    }
}
