using System.Text.RegularExpressions;

string folderPath = @"D:\yt\yt-dlp_win";

if (!Directory.Exists(folderPath))
{
    Console.WriteLine("Error: Folder does not exist.");
    return;
}

// Initialize Windows Shell Object
Type shellType = Type.GetTypeFromProgID("Shell.Application");
dynamic shell = Activator.CreateInstance(shellType);
dynamic folder = shell.NameSpace(folderPath);

int successCount = 0;
int skipCount = 0;

string[] files = Directory.GetFiles(folderPath);

foreach (string filePath in files)
{
    string ext = Path.GetExtension(filePath).ToLower();
    if (ext != ".mp3" && ext != ".flac") continue;

    string fileName = Path.GetFileName(filePath);
    dynamic folderItem = folder.ParseName(fileName);

    // Windows Shell Extended Property IDs: 21 is Title, 20 is Contributing Artists
    string title = folder.GetDetailsOf(folderItem, 21)?.ToString().Trim();
    string artist = folder.GetDetailsOf(folderItem, 20)?.ToString().Trim();

    // Strict check: Both tags must exist
    if (!string.IsNullOrEmpty(title) && !string.IsNullOrEmpty(artist))
    {
        // Clean invalid Windows file name characters
        string safeTitle = Regex.Replace(title, @"[\\/:*?""<>|]", "");
        string safeArtist = Regex.Replace(artist, @"[\\/:*?""<>|]", "");

        string newFileName = $"{safeTitle}-{safeArtist}{ext}";
        string newFilePath = Path.Combine(folderPath, newFileName);

        if (fileName == newFileName)
        {
            Console.WriteLine($"No change needed: {fileName}");
            continue;
        }

        if (File.Exists(newFilePath))
        {
            Console.WriteLine($"Skipped (Target exists): {newFileName}");
            skipCount++;
            continue;
        }

        try
        {
            File.Move(filePath, newFilePath);
            Console.WriteLine($"Renamed: {fileName} -> {newFileName}");
            successCount++;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to rename {fileName}: {ex.Message}");
            skipCount++;
        }
    }
    else
    {
        Console.WriteLine($"Skipped (Missing Tags): {fileName}");
        skipCount++;
    }
}

Console.WriteLine($"\nFinished! Success: {successCount}, Skipped: {skipCount}");


Console.WriteLine("Done.");
Console.WriteLine("Press any key to exit...");
Console.ReadKey();