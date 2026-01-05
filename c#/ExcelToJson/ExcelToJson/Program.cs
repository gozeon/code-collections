using Newtonsoft.Json;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;


partial class Program
{

    static List<Dictionary<string, string>> ReadExcel(string filePath)
    {
        var result = new List<Dictionary<string, string>>();

        using var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read);
        IWorkbook workbook = new XSSFWorkbook(fs);
        ISheet sheet = workbook.GetSheetAt(0);

        IRow headerRow = sheet.GetRow(0);
        int colCount = headerRow.LastCellNum;

        for (int i = 1; i <= sheet.LastRowNum; i++)
        {
            IRow row = sheet.GetRow(i);
            if (row == null) continue;

            var dict = new Dictionary<string, string>();

            for (int j = 0; j < colCount; j++)
            {
                string? key = headerRow.GetCell(j)?.ToString()?.Trim();
                if (string.IsNullOrEmpty(key)) continue;

                string value = row.GetCell(j)?.ToString()?.Trim() ?? "";
                dict[key] = value;
            }

            result.Add(dict);
        }

        return result;
    }

    static void SaveJson(string path, object data)
    {
        var json = JsonConvert.SerializeObject(data, Formatting.Indented);
        File.WriteAllText(path, json);
    }
    static void Main(string[] args)
    {
        if (args.Length < 1)
        {
            Console.WriteLine("用法：ExcelToJson.exe <input.xlsx> [output.json]");
            return;
        }

        string inputPath = Path.GetFullPath(args[0]);

        if (!File.Exists(inputPath))
        {
            Console.WriteLine("输入文件不存在：" + inputPath);
            return;
        }

        string outputPath;

        if (args.Length >= 2)
        {
            outputPath = Path.GetFullPath(args[1]);
        }
        else
        {
            outputPath = Path.ChangeExtension(inputPath, ".json");
        }

        try
        {
            var data = ReadExcel(inputPath);
            SaveJson(outputPath, data);

            Console.WriteLine("转换成功：");
            Console.WriteLine("输入：" + inputPath);
            Console.WriteLine("输出：" + outputPath);
        }
        catch (Exception ex)
        {
            Console.WriteLine("处理失败：" + ex.Message);
        }
    }
}