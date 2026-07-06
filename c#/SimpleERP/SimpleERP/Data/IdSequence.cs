using System.ComponentModel.DataAnnotations;

namespace SimpleERP.Data
{
    public class IdSequence
    {
        // 主键改为 格式如 "BQ-20260601" 或 "OQ-20260601"
        [Key]
        public string PrefixDayKey { get; set; } = string.Empty;

        // 当前该前缀在当月的最大序号
        public int CurrentValue { get; set; }
    }
}
