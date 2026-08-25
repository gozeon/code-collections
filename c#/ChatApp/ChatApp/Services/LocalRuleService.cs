using ChatApp.Models;
using System.Collections.Concurrent;
using System.Text.Json;

namespace ChatApp.Services
{
    public class LocalRuleService : IRuleService
    {
        private readonly ConcurrentDictionary<string, ComplianceRule> _rulesDatabase;

        public LocalRuleService(IWebHostEnvironment env)
        {
            string filePath = Path.Combine(env.ContentRootPath, "rules.json");
            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException("没找到rules文件");
            }

            string jsonContent = File.ReadAllText(filePath);
            var rawList = JsonSerializer.Deserialize<List<ComplianceRule>>(jsonContent);

            var tempDictionary = new Dictionary<string, ComplianceRule>(StringComparer.OrdinalIgnoreCase);

            if (rawList != null)
            {
                for (int i = 0; i < rawList.Count; i++)
                {
                    // 3. Automatically generate a safe, sequentially padded ID: RULE_001, RULE_002...
                    string generatedId = $"RULE_{(i + 1).ToString().PadLeft(3, '0')}";

                    var rule = rawList[i];
                    rule.RuleId = generatedId;

                    tempDictionary.Add(generatedId, rule);
                }
            }

            _rulesDatabase = new ConcurrentDictionary<string, ComplianceRule>(tempDictionary, StringComparer.OrdinalIgnoreCase);
        }

        public string GetMinimalRulesPrompt()
        {
            return string.Join("\n", _rulesDatabase.Select(r => $"{r.Key}: 用户反馈[{r.Value.Issue}]"));
        }

        public ComplianceRule? GetRuleById(string id)
        {
            _rulesDatabase.TryGetValue(id, out var rule);
            return rule;
        }
    }
}
