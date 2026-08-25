namespace UserProfileApi.Models
{
    public class HistoryInfo
    {
        public string Title { get; set; } = string.Empty;
        public string Tag { get; set; } = string.Empty;
        public string MediaType { get; set; } = string.Empty;
        public string MediaName => MediaType switch
        {
            "live" => "直播",
            "liveBack" => "回看",
            "vod" => "点播",
            "series" => "系列剧",
            "aggregation" => "合集",
            "episode" => "集锦",
            _ => "未知"
        };

        public DateTime Playtime { get; set; }
    }
}
