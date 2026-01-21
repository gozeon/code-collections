using FuzzySharp;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NPOI.SS.Formula.Functions;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using NPOI.XSSF.UserModel;
using Scriban;
using Scriban.Runtime;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using JsonIgnoreAttribute = Newtonsoft.Json.JsonIgnoreAttribute;

namespace Similar
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // ========= 1. 参数检查 =========
            //if (args.Length < 2)
            //{
            //    Console.WriteLine("Usage: AddressMatch.exe json1.json json2.json");
            //    return;
            //}

            //string jsonPath1 = args[0];
            //string jsonPath2 = args[1];

            //if (!File.Exists(jsonPath1) || !File.Exists(jsonPath2))
            //{
            //    Console.WriteLine("JSON file not found.");
            //    return;
            //}
            string baseDir = @"D:\电视购物订单\电视购物订单";
            Do2025youzhan(baseDir);
            Do2024youzhan(baseDir);
            Do2023youzhan(baseDir);
            return;

            //string jsonPath1 = Path.Combine(baseDir, "json", "订报纸信息.json");
            string jsonPath1 = Path.Combine(baseDir, "json", "今晚报数据统计.json");

            var json2List = new[]
            {
                Path.Combine(baseDir, "json", "400-2025全年.json"),
                Path.Combine(baseDir, "json", "400订单-2024全年.json"),
                Path.Combine(baseDir, "json", "400-2019-2023全部订单.json"),

                Path.Combine(baseDir, "json", "订单信息2.0.json"),

                Path.Combine(baseDir, "json", "有赞2025年.json"),
                Path.Combine(baseDir, "json", "2024年度有赞订单.json"),
                Path.Combine(baseDir, "json", "有赞2019-2023订单总和.json"),
            };

            var semaphore = new SemaphoreSlim(2); // ⭐ 同时最多 2 个
            var tasks = new List<Task>();

            foreach (var jsonPath2 in json2List)
            {
                tasks.Add(Task.Run(async () =>
                {
                    await semaphore.WaitAsync();
                    try
                    {
                        await CompareJson(baseDir, jsonPath1, jsonPath2);
                    }
                    finally
                    {
                        semaphore.Release();
                    }
                }));
            }

            await Task.WhenAll(tasks);
            Console.WriteLine("Done.");
            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }

        private static void Do2023youzhan(string baseDir)
        {
            string ajsonPath1 = Path.Combine(baseDir, "json", "今晚报数据统计.json");
            string ajsonPath2 = Path.Combine(baseDir, "手机", "有赞2019-2023订单总和.json");
            string outPath = Path.Combine(baseDir, "手机", "report", "有赞2019-2023订单总和.json");

            JArray arr1 = JArray.Parse(File.ReadAllText(ajsonPath1));
            JArray arr2 = JArray.Parse(File.ReadAllText(ajsonPath2));

            // 先把 path2 建成字典：手机号->对象
            var dict2 = arr2
                .Where(x => x["提货人手机号"] != null)
                .GroupBy(x => x["提货人手机号"]!.ToString())
                .ToDictionary(
                    g => g.Key,
                    g => g.Cast<JObject>().ToList()
                );

            Console.WriteLine($"有赞2019-2023订单 dict2 数量（唯一手机号数）: {dict2.Count}");

            var result = new JArray();

            foreach (JObject a in arr1)
            {
                var phone = a["电话"]?.ToString();
                if (string.IsNullOrEmpty(phone)) continue;

                if (dict2.TryGetValue(phone, out var orders))
                {
                    foreach (var order in orders)
                    {
                        var merged = new JObject();

                        foreach (var p in a.Properties())
                            merged[p.Name] = p.Value;

                        foreach (var p in order.Properties())
                            merged[p.Name] = p.Value;

                        result.Add(merged);
                    }
                }
            }

            File.WriteAllText(
                outPath,
                new JArray(result).ToString(Newtonsoft.Json.Formatting.Indented)
            );

            JsonToExcel(Path.ChangeExtension(outPath, "xlsx"), result);
        }

        private static void JsonToExcel(string excelFilePath, JArray arr)
        {
            IWorkbook workbook = new XSSFWorkbook();
            ISheet sheet = workbook.CreateSheet("Sheet1");

            if (!arr.Any())
            {
                using var fs = File.Create(excelFilePath);
                workbook.Write(fs);
                return;
            }

            // 所有字段名作为列头
            var headers = arr
                .SelectMany(x => ((JObject)x).Properties())
                .Select(p => p.Name)
                .Distinct()
                .ToList();

            // 文本格式（防止手机号变科学计数）
            ICellStyle textStyle = workbook.CreateCellStyle();
            textStyle.DataFormat = workbook.CreateDataFormat().GetFormat("@");

            // 表头
            IRow headerRow = sheet.CreateRow(0);
            for (int i = 0; i < headers.Count; i++)
            {
                headerRow.CreateCell(i).SetCellValue(headers[i]);
            }

            // 数据
            for (int r = 0; r < arr.Count; r++)
            {
                var obj = (JObject)arr[r];
                IRow row = sheet.CreateRow(r + 1);

                for (int c = 0; c < headers.Count; c++)
                {
                    var cell = row.CreateCell(c);
                    cell.CellStyle = textStyle;

                    cell.SetCellValue(
                        obj.TryGetValue(headers[c], out var v)
                            ? v.ToString()
                            : ""
                    );
                }
            }

            // 自动列宽
            for (int i = 0; i < headers.Count; i++)
            {
                sheet.AutoSizeColumn(i);
            }

            using var file = File.Create(excelFilePath);
            workbook.Write(file);
        }

        private static void Do2024youzhan(string baseDir)
        {
            string ajsonPath1 = Path.Combine(baseDir, "json", "今晚报数据统计.json");
            string ajsonPath2 = Path.Combine(baseDir, "手机", "2024年度有赞订单.json");
            string outPath = Path.Combine(baseDir, "手机", "report", "2024年度有赞订单.json");

            JArray arr1 = JArray.Parse(File.ReadAllText(ajsonPath1));
            JArray arr2 = JArray.Parse(File.ReadAllText(ajsonPath2));

            // 先把 path2 建成字典：手机号->对象
            var dict2 = arr2
                .Where(x => x["收货人手机号"] != null)
                .GroupBy(x => x["收货人手机号"]!.ToString())
                .ToDictionary(
                    g => g.Key,
                    g => g.Cast<JObject>().ToList()
                );

            Console.WriteLine($"2024年度有赞订单 dict2 数量（唯一手机号数）: {dict2.Count}");

            var result = new JArray();

            foreach (JObject a in arr1)
            {
                var phone = a["电话"]?.ToString();
                if (string.IsNullOrEmpty(phone)) continue;

                if (dict2.TryGetValue(phone, out var orders))
                {
                    foreach (var order in orders)
                    {
                        var merged = new JObject();

                        foreach (var p in a.Properties())
                            merged[p.Name] = p.Value;

                        foreach (var p in order.Properties())
                            merged[p.Name] = p.Value;

                        result.Add(merged);
                    }
                }
            }

            File.WriteAllText(
                outPath,
                new JArray(result).ToString(Newtonsoft.Json.Formatting.Indented)
            );
            JsonToExcel(Path.ChangeExtension(outPath, "xlsx"), result);
        }

        private static void Do2025youzhan(string baseDir)
        {
            string ajsonPath1 = Path.Combine(baseDir, "json", "今晚报数据统计.json");
            string ajsonPath2 = Path.Combine(baseDir, "手机", "有赞2025年.json");
            string outPath = Path.Combine(baseDir, "手机", "report", "有赞2025年.json");

            JArray arr1 = JArray.Parse(File.ReadAllText(ajsonPath1));
            JArray arr2 = JArray.Parse(File.ReadAllText(ajsonPath2));

            // 先把 path2 建成字典：手机号->对象
            var dict2 = arr2
                .Where(x => x["买家手机号"] != null)
                .GroupBy(x => x["买家手机号"]!.ToString())
                .ToDictionary(
                    g => g.Key,
                    g => g.Cast<JObject>().ToList()
                );

            Console.WriteLine($"有赞2025年dict2 数量（唯一手机号数）: {dict2.Count}");

            var result = new JArray();

            foreach (JObject a in arr1)
            {
                var phone = a["电话"]?.ToString();
                if (string.IsNullOrEmpty(phone)) continue;

                if (dict2.TryGetValue(phone, out var orders))
                {
                    foreach (var order in orders)
                    {
                        var merged = new JObject();

                        foreach (var p in a.Properties())
                            merged[p.Name] = p.Value;

                        foreach (var p in order.Properties())
                            merged[p.Name] = p.Value;

                        result.Add(merged);
                    }
                }
            }

            File.WriteAllText(
                outPath,
                new JArray(result).ToString(Newtonsoft.Json.Formatting.Indented)
            );
            JsonToExcel(Path.ChangeExtension(outPath, "xlsx"), result);
        }

        private static async Task CompareJson(string baseDir, string jsonPath1, string jsonPath2)
        {
            // ========= 2.读取 JSON =========
            var json1 = ReadJson(jsonPath1, new FieldMap { IdField = "电话", AddressField = "住址" });
            var json2 = ReadJson(jsonPath2, new FieldMap { IdField = "机顶盒号", AddressField = "收货地址" });

            Console.WriteLine($"{Path.GetFileNameWithoutExtension(jsonPath1)}: {json1.Count}, {Path.GetFileNameWithoutExtension(jsonPath2)}: {json2.Count}");

            // ========= 3. 地址预处理 =========
            json1.ForEach(x => x.Parsed = Parse(x.Address));
            json2.ForEach(x => x.Parsed = Parse(x.Address));

            // ========= 4. 匹配 =========
            var results = MatchAddresses(json1, json2);

            // ========= 5. 输出 =========
            string templatePath = Path.Combine(AppContext.BaseDirectory, "report.tpl.html");
            string outputPath = Path.Combine(baseDir, "report", Path.GetFileName(Path.ChangeExtension(jsonPath2, ".html")));
            await Task.WhenAll(
              Task.Run(() =>
              {
                  foreach (var r in results)
                  {
                      if (r.Score > 90)
                      {
                          Console.WriteLine($"{r.Left.Address} -> {r.Right.Address} | {r.Score}");

                      }
                  }
              }),
              Task.Run(() => ExportHtmlWithScriban(results, templatePath, outputPath)),
              Task.Run(() => ExportExcelWithNpoi(results, Path.ChangeExtension(outputPath, ".xlsx")))
          );
        }

        private static void ExportExcelWithNpoi(List<MatchResult> results, string outputPath)
        {
            IWorkbook workbook = new XSSFWorkbook();
            ISheet sheet = workbook.CreateSheet("对比结果(>85分)");

            // 表头
            ICellStyle headerStyle = workbook.CreateCellStyle();
            IFont headerFont = workbook.CreateFont();
            headerFont.IsBold = true;
            headerStyle.SetFont(headerFont);
            headerStyle.Alignment = HorizontalAlignment.Center;
            headerStyle.VerticalAlignment = VerticalAlignment.Center;

            IRow row0 = sheet.CreateRow(0);
            row0.HeightInPoints = 25;

            row0.CreateCell(0).SetCellValue("订报纸信息");
            row0.GetCell(0).CellStyle = headerStyle;
            sheet.AddMergedRegion(new CellRangeAddress(0, 0, 0, 2));

            row0.CreateCell(3).SetCellValue("订单信息");
            row0.GetCell(3).CellStyle = headerStyle;
            sheet.AddMergedRegion(new CellRangeAddress(0, 0, 3, 4));

            IRow row1 = sheet.CreateRow(1);
            row1.HeightInPoints = 22;
            string[] subHeaders = { "姓名", "电话", "住址", "收货地址", "订单ID/机顶盒号", "得分" };
            for (int i = 0; i < subHeaders.Length; i++)
            {
                var cell = row1.CreateCell(i);
                cell.SetCellValue(subHeaders[i]);
                cell.CellStyle = headerStyle;
            }

            // 内容

            int rowIndex = 2;

            List<Dictionary<string, object>> b = results.OrderByDescending(r => r.Score).Select(r => new Dictionary<string, object>
            {
                ["姓名"] = r.Left.Origin.TryGetValue("姓名", out var v)? v?.ToString() ?? "": "",
                ["电话"] = r.Left.Origin.TryGetValue("电话", out var v1)? v1?.ToString() ?? "": "",
                ["住址"] = r.Left.Origin.TryGetValue("住址", out var v2)? v2?.ToString() ?? "": "",
                ["收货地址"] = r.Right.Origin.TryGetValue("收货地址", out var v3)? v3?.ToString() ?? "": "",
                ["机顶盒号"] = r.Right.Origin.TryGetValue("机顶盒号", out var v4)? v4?.ToString() ?? "": "",
                ["score"] = r.Score,

                ["住址格式化"] = r.Left.Parsed.CleanText,
                ["收获地址格式化"] = r.Right.Parsed.CleanText,


            }).ToList();

            foreach (var r in b)
            {
                IRow row = sheet.CreateRow(rowIndex++);


                row.CreateCell(1).SetCellValue((string)r["电话"]);
                row.CreateCell(0).SetCellValue((string)r["姓名"]);
                row.CreateCell(2).SetCellValue((string)r["住址"]);

                row.CreateCell(3).SetCellValue((string)r["收货地址"]);
                row.CreateCell(4).SetCellValue((string)r["机顶盒号"]);

                row.CreateCell(5).SetCellValue((int)r["score"]);

                //row.CreateCell(6).SetCellValue((string)r["住址格式化"]);
                //row.CreateCell(7).SetCellValue((string)r["收获地址格式化"]);
            }

            // 自动列宽
            for (int i = 0; i <= 7; i++)
            {
                sheet.AutoSizeColumn(i);

                // 中文列宽补偿（非常重要）
                int currentWidth = (int)sheet.GetColumnWidth(i);
                sheet.SetColumnWidth(i, Math.Min(currentWidth + 1024, 255 * 256));
            }

            // ===== 写入文件 =====
            using (var fs = new FileStream(outputPath, FileMode.Create, FileAccess.Write))
            {
                workbook.Write(fs);
            }
        }

        private static void ExportHtmlWithScriban(List<MatchResult> results, string templatePath, string outputPath)
        {
            var templateText = File.ReadAllText(templatePath, Encoding.UTF8);
            var template = Template.Parse(templateText);

            var model = new
            {
                high = results.Where(r => r.Score >= 90)
                              .OrderByDescending(r => r.Score)
                              .ToList(),

                mid = results.Where(r => r.Score >= 80 && r.Score < 90)
                              .OrderByDescending(r => r.Score)
                              .ToList(),
               
                all = results.OrderByDescending(r => r.Score).ToList()
            };

            var data = new ScriptObject();

            // Add individual key/value pairs
            data.Add("all", results.OrderByDescending(r => r.Score).Select(r=> new
            {
                left = new {origin = r.Left.Origin},
                right = new { origin = r.Right.Origin },
                score = r.Score,
            }).ToList());


            var context = new TemplateContext();
            context.LoopLimit = 100_000;
            context.PushGlobal(data);


            string html = template.Render(context);

            File.WriteAllText(outputPath, html, Encoding.UTF8);
        }

        // =====================================================
        // 数据结构
        // =====================================================
        public class FieldMap
        {
            public string IdField { get; set; } = "";
            public string AddressField { get; set; } = "";
        }

        public class AddressRecord
        {
            public int Id { get; set; }
            public string Address { get; set; } = "";
            public required Dictionary<string, object> Origin { get; set; }
            [JsonIgnore]
            public ParsedAddress Parsed { get; set; } = new();
        }

        public class ParsedAddress
        {
            public string CleanText { get; set; } = "";
            public string BucketKey { get; set; } = "";
        }

        public class MatchResult
        {
            public AddressRecord Left { get; set; }
            public AddressRecord Right { get; set; }

            public int Score { get; set; }
        }

        // =====================================================
        // JSON 读取
        // =====================================================

        static List<AddressRecord> ReadJson(string path)
        {
            var json = File.ReadAllText(path);
            return JsonConvert.DeserializeObject<List<AddressRecord>>(json)
                   ?? new List<AddressRecord>();
        }

        static List<AddressRecord> ReadJson(string path, FieldMap map)
        {
            var json = File.ReadAllText(Path.GetFullPath(path));
            var rows = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(json) ?? new();
            var list = new List<AddressRecord>();
            int autoId = 1;
            foreach(var r in rows)
            {
                string addr = r.TryGetValue(map.AddressField, out var a) ? a?.ToString() ?? "" : "";

                int id;
                if (r.TryGetValue(map.IdField, out var v) && int.TryParse(v?.ToString(), out id))
                {
                    // ok
                }
                else
                {
                    id = autoId++;
                }

                list.Add(new AddressRecord
                {
                    Id = id,
                    Address = addr,
                    Origin = r
                });
            }
            return list;
        }

        // =====================================================
        // 地址解析 & 预处理
        // =====================================================

        static ParsedAddress Parse(string address)
        {
            string clean = Normalize(address);

            return new ParsedAddress
            {
                CleanText = clean,
                BucketKey = BuildBucket(clean)
            };
        }

        static string Normalize(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return "";

            // ① 中文数字 → 阿拉伯数字
            text = text
                .Replace("一", "1")
                .Replace("二", "2")
                .Replace("三", "3")
                .Replace("四", "4")
                .Replace("五", "5")
                .Replace("六", "6")
                .Replace("七", "7")
                .Replace("八", "8");

            text = text.ToLower();
            text = text.Replace("天津市区", "")
                       .Replace("天津市", "")
                       .Replace("号楼", "-")
                       .Replace("栋", "-")
                       .Replace("单元", "-")
                       .Replace("门", "-")
                       .Replace("室", "")
                       .Replace("号", "")
                       .Replace("－", "-")
                       .Replace("—", "-")
                       .Replace("～", "-");

            text = RemoveInvisibleChars(text);
            return text;
        }

        private static string RemoveInvisibleChars(string text)
        {
            if (string.IsNullOrEmpty(text)) return text;

            var sb = new StringBuilder(text.Length);

            foreach (char c in text)
            {
                var cat = char.GetUnicodeCategory(c);

                if (char.IsWhiteSpace(c)) continue;          // 所有空白
                if (cat == UnicodeCategory.Control) continue;
                if (cat == UnicodeCategory.Format) continue; // 方向符、零宽符

                sb.Append(c);
            }

            return sb.ToString();
        }

        static string BuildBucket(string text)
        {
            var districts = new List<string>
            {
                "和平区",
                "河西区",
                "河东区",
                "南开区",
                "红桥区",
                "河北区",
                "东丽区",
                "西青区",
                "津南区",
                "北辰区",
                "武清区",
                "宝坻区",
                "滨海新区",
                "静海区",
                "宁河区",
                "蓟州区",
                "大港区"
            };
            foreach (var d in districts)
            {
                if (text.Contains(d))
                {
                    return d;
                }
            }

            // 兜底：未知区
            return "UNKNOWN";
        }

        // =====================================================
        // 相似度
        // =====================================================

        static int FuzzySimilarity(string a, string b)
        {
            return Math.Max(
                Fuzz.Ratio(a, b),
                Fuzz.TokenSetRatio(a, b)
            );
        }

        // =====================================================
        // 索引
        // =====================================================

        static Dictionary<string, List<AddressRecord>> BuildIndex(List<AddressRecord> list)
        {
            var dict = new Dictionary<string, List<AddressRecord>>();

            foreach (var item in list)
            {
                if (!dict.TryGetValue(item.Parsed.BucketKey, out var bucket))
                {
                    bucket = new List<AddressRecord>();
                    dict[item.Parsed.BucketKey] = bucket;
                }
                bucket.Add(item);
            }
            return dict;
        }

        // =====================================================
        // 核心：并行匹配，取最高分
        // =====================================================

        static List<MatchResult> MatchAddresses(
            List<AddressRecord> json1,
            List<AddressRecord> json2)
        {
            var index2 = BuildIndex(json2);
            var results = new ConcurrentBag<MatchResult>();

            var options = new ParallelOptions
            {
                // 核心数除2 不容易跑满
                MaxDegreeOfParallelism = Environment.ProcessorCount / 2
            };

            Parallel.ForEach(json1, options, a =>
            {
                if (!index2.TryGetValue(a.Parsed.BucketKey, out var candidates))
                    return;

                int bestScore = -1;
                AddressRecord? best = null;

                foreach (var b in candidates)
                {
                    int score = FuzzySimilarity(
                        a.Parsed.CleanText,
                        b.Parsed.CleanText);

                    // 去掉街道 进行对比
                    int score2 = FuzzySimilarity(
                        RemoveStreet(a),
                        RemoveStreet(b));

                    // 如果分数高，再提取街道进行对比
                    // 河西区渌水道龙瀚东园8 - 1001    河西区 浯水道与艺林路交口龙瀚东园8-1001
                    // 常德道66号 塘沽区睦宁路66号 这种情况继续对比街道
                    if ((score2 > 95 && score2 < 100) || (score2 == 100 && !a.Parsed.CleanText.Contains("-")))
                    {
                        string street_a = ExtractStreet(a);
                        string street_b = ExtractStreet(b);
                        if (!string.IsNullOrEmpty(street_a) && !string.IsNullOrEmpty(street_b))
                        {
                            int streetScore = -1;
                            // 有一种是写了交口，分数会低，比如：微山路 陈塘庄街道微山路 96
                            // 包含关系优先
                            if (street_a.Contains(street_b) || street_b.Contains(street_a))
                            {
                                streetScore = 100;
                            } 
                            else
                            {
                                streetScore = FuzzySimilarity(street_a, street_b);
                            }
                            double streetWeight = 0.2;

                            // 如果街道是满分，则不影响 score2
                            if (streetScore >= 100)
                            {
                                score2 = score2 * streetScore / 100;
                            }
                            else
                            {
                                // 加权计算
                                score2 = (int)(score2 * (1 - streetWeight) + score2 * (streetScore / 100.0) * streetWeight);
                            }


                            Console.WriteLine($"{street_a} {street_b} {score2}");
                        }
                    }

                    if (score2 > score)
                    {
                        score = score2;
                    }

                    if (score > bestScore)
                    {
                        bestScore = score;
                        best = b;
                    }
                }

                if (best != null && bestScore >= 85)
                {
                    results.Add(new MatchResult
                    {
                        Left = a,
                        Right = best,
                        Score = bestScore
                    });
                }
            });

            return results.ToList();
        }

        private static string ExtractStreet(AddressRecord addr)
        {
            return Regex.Match(addr.Parsed.CleanText.Replace(addr.Parsed.BucketKey, ""), @"\S+(路|街|道|大道)").Value;
        }

        private static string RemoveStreet(AddressRecord addr)
        {

            return Regex.Replace(
                    addr.Parsed.CleanText.Replace(addr.Parsed.BucketKey, ""),
                    @"\S+(路|街|道|大道)",
                    "");
        }
    }
}
