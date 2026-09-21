using System;
using System.Globalization;
using System.IO;
using Path = System.IO.Path;
using System.Text;

namespace Rename.Services
{
    /// <summary>
    /// 模板占位符解析。
    /// 支持：#（一个有序数字，连续 # 的个数为补零宽度）、*（原文件名，不含扩展名）、
    /// $P（父文件夹名）、$Y 年、$M 月、$D 日、$H 时、$N 分、$S 秒。
    /// 例如 Image##### + 第 32 个文件 =&gt; Image00032。
    /// </summary>
    public static class TemplateEngine
    {
        public static string Resolve(
            string template,
            string originalNameWithoutExtension,
            string parentFolderName,
            DateTime time,
            int number)
        {
            if (string.IsNullOrEmpty(template))
            {
                template = "*";
            }

            var builder = new StringBuilder(template.Length + 16);

            for (int i = 0; i < template.Length; i++)
            {
                char current = template[i];

                if (current == '#')
                {
                    int end = i;
                    while (end < template.Length && template[end] == '#')
                    {
                        end++;
                    }

                    int width = end - i;
                    builder.Append(number.ToString(CultureInfo.InvariantCulture).PadLeft(width, '0'));
                    i = end - 1;
                    continue;
                }

                if (current == '*')
                {
                    builder.Append(originalNameWithoutExtension);
                    continue;
                }

                if (current == '$' && i + 1 < template.Length)
                {
                    char key = char.ToUpperInvariant(template[i + 1]);
                    string? value = key switch
                    {
                        'P' => parentFolderName,
                        'Y' => time.ToString("yyyy", CultureInfo.InvariantCulture),
                        'M' => time.ToString("MM", CultureInfo.InvariantCulture),
                        'D' => time.ToString("dd", CultureInfo.InvariantCulture),
                        'H' => time.ToString("HH", CultureInfo.InvariantCulture),
                        'N' => time.ToString("mm", CultureInfo.InvariantCulture),
                        'S' => time.ToString("ss", CultureInfo.InvariantCulture),
                        _ => null,
                    };

                    if (value is not null)
                    {
                        builder.Append(value);
                        i++;
                        continue;
                    }
                }

                builder.Append(current);
            }

            string result = Sanitize(builder.ToString());
            return result.Length == 0 ? originalNameWithoutExtension : result;
        }

        /// <summary>去掉文件名中的非法字符与结尾的点、空格。</summary>
        public static string Sanitize(string name)
        {
            var builder = new StringBuilder(name.Length);
            char[] invalid = Path.GetInvalidFileNameChars();

            foreach (char c in name)
            {
                builder.Append(Array.IndexOf(invalid, c) >= 0 ? '_' : c);
            }

            return builder.ToString().Trim().TrimEnd('.');
        }
    }
}
