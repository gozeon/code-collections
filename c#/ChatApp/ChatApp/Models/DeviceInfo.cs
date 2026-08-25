namespace ChatApp.Models
{
    public class DeviceInfo
    {
        public int Platform { get; set; }
        public string PlatformName => Platform switch
        {
            0 => "IOS",
            1 => "Android",
            2 => "鸿蒙",
            _ => "未知"
        };
        public string Model { get; set; } = string.Empty;
        public string SysVersion { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public DateTime Time { get; set; }
        
    }
}
