using ChatApp.Models;
using Dapper;
using Microsoft.Extensions.AI;
using System.ComponentModel;
using System.Text;

namespace ChatApp.Services
{
    public class CustomerServiceToolkit
    {
        private readonly IFaqDbConnectionFactory _faqDbConnectionFactory;
        private readonly IMediaDbConnectionFactory _mediaDbConnectionFactory;

        private readonly IChatClient _chatClient;

        private readonly ILogger<CustomerServiceToolkit> _logger;
        private readonly IRuleService _ruleService;

        public CustomerServiceToolkit(IFaqDbConnectionFactory faqDbConnection, IMediaDbConnectionFactory mediaDbConnection, IChatClient chatClient, ILogger<CustomerServiceToolkit> logger, IRuleService ruleService)
        {
            _faqDbConnectionFactory = faqDbConnection;
            _mediaDbConnectionFactory = mediaDbConnection;
            _chatClient = chatClient;
            _logger = logger;
            _ruleService = ruleService;
        }

        // ================= 第一部分：用户多维度画像工具 =================

        [Description("获取指定用户的设备与网络环境信息，如App版本、操作系统、网络信号等")]
        public async Task<string> GetDeviceEnvironmentAsync(
            [Description("用户的唯一标识符，例如 user_888")] string userId)
        {
            //查找设备信息
            using var faqConn = _faqDbConnectionFactory.CreateConnection();
            var deviceSql = "select platform, sysVersion, model, time, version from device_record where deviceId=@DeviceId";
            var deviceInfo = await faqConn.QueryFirstOrDefaultAsync<DeviceInfo>(deviceSql, new { DeviceId = userId });

            // 处理信息
            if (deviceInfo is null)
            {
                return $"用户 {userId} 无设备信息";
            }
            return $"用户 {userId} 的常用设备: {deviceInfo.Model},当前在线设备: {deviceInfo.Model}, 系统: {deviceInfo.PlatformName}, App版本: {deviceInfo.Version}";
        }

        [Description("获取用户近期的观看/收听历史标题与标签偏好")]
        public async Task<string> GetWatchHistoryAsync(
            [Description("用户的唯一标识符")] string userId
            )
        {
            //查找设备观看记录
            using var mediaConn = _mediaDbConnectionFactory.CreateConnection();
            var historySql = @"
                SELECT t.item_name as Title, t.tag_names as Tag, t.media_type as MediaType, t.play_time as Playtime
                FROM wise_ai_media.user_history_v2 t
                WHERE device_id=@DeviceId
                order by play_time desc
                LIMIT 15
                ";
            var historyInfos = await mediaConn.QueryAsync<HistoryInfo>(historySql, new { DeviceId = userId });

            var historyPrompt = $"用户{userId} 无观看信息";
            if (historyInfos.Any())
            {
                var sb = new StringBuilder();
                sb.AppendLine($"- 用户 {userId} 观看视频列表（标题+类型标签）：");

                var lines = historyInfos.Select((info, index) =>
                {
                    return $" {index + 1}. 《{info.Title}》 - [{info.Tag}]";
                });
                sb.Append(string.Join(Environment.NewLine, lines));

                historyPrompt = sb.ToString();
            }

            return historyPrompt;
        }

        [Description("获取用户近期提交的客服历史对话、工单及投诉记录")]
        public async Task<string> GetSupportTicketsAsync(
            [Description("用户的唯一标识符")] string userId)
        {
            //查找设备对话信息
            using var faqConn = _faqDbConnectionFactory.CreateConnection();
            var chatSql = @"
                select send_user as SendUser ,receive_user as ReceiveUser, message, time
                 from feedback_chat
                 where send_user=@DeviceId 
                    or receive_user=@DeviceId
                 order by time desc
                 limit 10
                ";
            var chatInfos = await faqConn.QueryAsync<ChatInfo>(chatSql, new { DeviceId = userId });

            if (chatInfos.Any())
            {
                var sb = new StringBuilder();
                sb.AppendLine("- 【最新对话文本片段/摘要】：");

                var lines = chatInfos.Select((info, index) =>
                {
                    var user = info.SendUser == "admin" ? "客服" : "用户";
                    return $" {user} : {info.Message}";
                });
                sb.Append(string.Join(Environment.NewLine, lines));

                return sb.ToString();
            }

            return $"用户 {userId} 无工单历史";
        }

        // ================= 第二部分：公司合规规则检索工具（Function Calling） =================

        [Description("【规则检索】根据用户的提问意图，从话术列表中匹配最符合的标准问题ID。")]
        public async Task<string> GetSubRulesByCategoryAsync(
            [Description("用户的原始提问或核心诉求")] string categoryCode)
        {
            return _ruleService.GetMinimalRulesPrompt();
        }

        [Description("【规则检索】根据选定的标准话术ID，获取该话术的完整标准答案")]
        public async Task<string> GetRuleContentByIdAsync(
            [Description("选中的话术ID，例如 RULE_001")] string ruleId)
        {
            var officialRule = _ruleService.GetRuleById(ruleId);
            if(officialRule is not null)
            {
                return $"问题: {officialRule.Issue} 标准回答:{officialRule.StandardReply}";

            }
            return "未找到对应的话术内容。";
        }
}
}
