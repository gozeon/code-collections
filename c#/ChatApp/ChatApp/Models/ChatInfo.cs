namespace ChatApp.Models
{
    public class ChatInfo
    {
        public string SendUser { get; set; } = string.Empty;
        public string ReceiveUser { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime Time { get; set; }
    }
}
