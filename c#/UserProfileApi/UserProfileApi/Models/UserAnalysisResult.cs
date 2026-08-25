using System.Text.Json.Serialization;

namespace UserProfileApi.Models
{
    public class UserAnalysisResult
    {
        [JsonPropertyName("user_labels")]
        public UserLabels UserLabels { get; set; }

        [JsonPropertyName("core_pain_point")]
        public string CorePainPoint { get; set; }

        // 🔥 核心：大模型挑选出的规则ID
        [JsonPropertyName("matched_rule_ids")]
        public List<string> MatchedRuleIds { get; set; }

        [JsonPropertyName("action_direction")]
        public string ActionDirection { get; set; }

        [JsonPropertyName("communication_tips")]
        public CommunicationTips CommunicationTips { get; set; }
    }

    public class CommunicationTips
    {
        [JsonPropertyName("style")]
        public string Style { get; set; }

        [JsonPropertyName("minefield")]
        public string Minefield { get; set; }

        [JsonPropertyName("opening_line")]
        public string OpeningLine { get; set; }
    }

    public class UserLabels
    {
        [JsonPropertyName("active_tag")]
        public string ActiveTag { get; set; }

        [JsonPropertyName("communication_tag")]
        public string CommunicationTag { get; set; }

        [JsonPropertyName("movie_personality_tag")]
        public string MoviePersonalityTag { get; set; }
    }
}
