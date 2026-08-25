using System.Text.Json.Serialization;

namespace ChatApp.Models
{
    public class ComplianceRule
    {
        // Automatically populated during file loading
        public string RuleId { get; set; } = string.Empty;

        [JsonPropertyName("具体问题")]
        public string Issue { get; set; } = string.Empty;

        [JsonPropertyName("话术")]
        public string StandardReply { get; set; } = string.Empty;
    }
}
