using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR.Protocol;
using Microsoft.Extensions.AI;
using System.Text;
using System.Text.Json;
using UserProfileApi.Interfaces;
using UserProfileApi.Models;

namespace UserProfileApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly IFaqDbConnectionFactory _faqDbConnectionFactory;
        private readonly IMediaDbConnectionFactory _mediaDbConnectionFactory;

        private readonly IChatClient _chatClient;

        private readonly ILogger<UserProfileController> _logger;
        private readonly IRuleService _ruleService;

        public UserProfileController(IFaqDbConnectionFactory faqDbConnection, IMediaDbConnectionFactory mediaDbConnection, IChatClient chatClient, ILogger<UserProfileController> logger, IRuleService ruleService)
        {
            _faqDbConnectionFactory = faqDbConnection;
            _mediaDbConnectionFactory = mediaDbConnection;
            _chatClient = chatClient;
            _logger = logger;
            _ruleService = ruleService;
        }

        [HttpGet("{deviceId}")]
        public async Task<IActionResult> Get(string deviceId)
        {
            // TODO: 使用 Task.WhenAll + Dapper QueryMultipleAsync 进行并行优化
            //查找设备信息
            using var faqConn = _faqDbConnectionFactory.CreateConnection();
            var deviceSql = "select platform, sysVersion, model, time, version from device_record where deviceId=@DeviceId";
            var deviceInfo = await faqConn.QueryFirstOrDefaultAsync<DeviceInfo>(deviceSql, new { DeviceId = deviceId });

            //查找设备对话信息
            var chatSql = @"
                select send_user as SendUser ,receive_user as ReceiveUser, message, time
                 from feedback_chat
                 where send_user=@DeviceId 
                    or receive_user=@DeviceId
                 order by time desc
                 limit 10
                ";
            var chatInfos = await faqConn.QueryAsync<ChatInfo>(chatSql, new { DeviceId = deviceId });

            //查找设备观看记录
            using var mediaConn = _mediaDbConnectionFactory.CreateConnection();
            var historySql = @"
                SELECT t.item_name as Title, t.tag_names as Tag, t.media_type as MediaType, t.play_time as Playtime
                FROM wise_ai_media.user_history_v2 t
                WHERE device_id=@DeviceId
                order by play_time desc
                LIMIT 15
                ";
            var historyInfos = await mediaConn.QueryAsync<HistoryInfo>(historySql, new { DeviceId = deviceId });


            var devicePrompt = "新用户无设备信息";
            // 处理信息
            if(deviceInfo is not null)
            {
                devicePrompt = $"""
                    - 常用设备：{deviceInfo.Model}
                    - 当前在线设备：{deviceInfo.Model}
                    - 系统/App版本：{deviceInfo.PlatformName} {deviceInfo.SysVersion} / {deviceInfo.Version}
                    """;
            }

            var historyPrompt = "新用户无观看信息";
            if (historyInfos.Any())
            {
                var sb = new StringBuilder();
                sb.AppendLine("- 观看视频列表（标题+类型标签）：");

                var lines = historyInfos.Select((info, index) =>
                {
                    return $" {index + 1}. 《{info.Title}》 - [{info.Tag}]";
                });
                sb.Append(string.Join(Environment.NewLine, lines));

                historyPrompt = sb.ToString();
            }

            var chatPrompt = "新用户无工单历史";
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

                chatPrompt = sb.ToString();
            }

            var rules = _ruleService.GetMinimalRulesPrompt();

            // 拼装提示词

            var sysMessage = $"""
# Role
你是一位精通流媒体平台运营、用户行为分析与心理学沟通的专家级 AI 助手。

# Task
请对下方提供的流媒体平台用户多维度数据（设备信息、观看历史标题与标签、客服对话历史）进行深度交叉分析。你的目标是帮助客服人员在后续对话中“秒懂用户”，请输出一份精炼、无废话、可直接展示在客服聊天边栏的【用户画像与沟通指南】。

# Rules
1. 拒绝冗长套话，只输出干货，每条分析必须有数据支撑。
2. 结合设备和【观看视频的标题与标签】，深度推断用户的“观影人格”（例如：通过恐怖片标题推断为重口味爱好者，通过少儿标签推断为宝妈群体）与“当前潜在痛点”。
3. 结合对话记录，提炼用户的“沟通性格”与“雷区”。
4. 【核心合规要求】：仔细阅读下方的[公司合规规则索引]。根据用户的设备、痛点与对话，**必须**找出适用的规则 ID（可多选）。你制定的客服方向绝对不能与这些规则冲突。

# [公司合规规则索引]
{rules}

# Output Format
你必须严格按照指定的 JSON Schema 结构进行输出。输出的 JSON 对象必须包含以下字段：
- user_labels: 包含 active_tag(活跃依赖), communication_tag(沟通性格), movie_personality_tag(观影人格)
- core_pain_point: 用户当前最核心的不满或遭遇（一句话说清）
- matched_rule_ids: 数组类型。根据用户当前情况，命中并必须执行的[公司合规规则索引]中的 ID 列表（例如 [""RULE_001"", ""RULE_003""]）。如果没有命中任何规则，则返回空数组 []。
- action_direction: 结合规则给出的客服行动方向建议。
- communication_tips: 包含 style(推荐话术风格), minefield(雷区勿踩), opening_line(15字以内黄金开场白建议)
""";

//# Output Format
//请严格按照以下格式输出：

//## 1. 核心标签（直接用于边栏置顶）
//- 活跃与依赖标签：[例如：重度老骨灰 / 偶尔活跃 / 深度动漫迷]
//- 沟通性格标签：[例如：理性逻辑型 / 情绪易激型 / 简短文字型 / 极度焦虑型]
//- 观影人格标签：[结合视频标题与标签推导，例如：硬核悬疑控 / 下饭剧常客 / 亲子合家欢]

//## 2. 核心痛点与就诊原因（他为什么进线）
//- 用户当前最核心的不满或遭遇：[用一句话说清，例如：在TV端连续观看《视频标题A》时遭遇报错/中断，导致情绪烦躁]

//## 3. 沟通话术建议（教客服怎么聊）
//- 【推荐话术风格】：[例如：主动破冰，直接给解决方案，避免安抚套话 / 语气轻松并引用其常看圈子的梗 / 语调放缓并真诚致歉]
//- 【雷区勿踩】：[例如：千万不要让他去重启路由器，他已经试过了 / 不要推荐付费内容 / 避免长篇大论]
//- 【黄金开场白建议】：[结合当前痛点和性格，提供一句15字以内的开场/切入语]
//";

            var userMessage = $"""
请基于以下真实数据进行分析：

用户：{deviceId}

### [数据1：用户设备与环境]
{devicePrompt}

### [数据2：近期观看记录（近7天视频标题与标签）]
{historyPrompt}


### [数据3：客服对话及工单历史]
{chatPrompt}
""";

            var messages = new List<ChatMessage>
            {
                new ChatMessage(ChatRole.System, sysMessage),
                new ChatMessage(ChatRole.User, userMessage),
            };

            _logger.LogInformation(sysMessage);
            _logger.LogInformation(userMessage);

            var chatOptions = new ChatOptions {
                ResponseFormat = ChatResponseFormat.Json,
            };
            var response = await _chatClient.GetResponseAsync(messages, chatOptions);
            string jsonText = response?.Text ?? "{}";
            UserAnalysisResult userAnalysisResult = JsonSerializer.Deserialize<UserAnalysisResult>(jsonText);

            var complianceRepliesList = new List<ComplianceRule>();

            if (userAnalysisResult?.MatchedRuleIds != null)
            {
                foreach (var id in userAnalysisResult.MatchedRuleIds)
                {
                    // 从 IRuleService 中获取（带有 RuleId, Issue, StandardReply 的实体）
                    var officialRule = _ruleService.GetRuleById(id);
                    if (officialRule != null)
                    {
                        complianceRepliesList.Add(officialRule);
                    }
                }
            }

            var result = new
            {
                DeviceInfo = deviceInfo,
                ChatInfo = chatInfos,
                HistoryInfo = historyInfos,
                UserAnalysisResult = userAnalysisResult,
                ComplianceReplies = complianceRepliesList
            };

            //return Content(response.Text, "text/html", System.Text.Encoding.UTF8);
            return Ok(result);

        }
    }
}
