using ChatApp.Models;

namespace ChatApp.Services
{
    public interface IRuleService
    {
        string GetMinimalRulesPrompt();
        ComplianceRule? GetRuleById(string id);
    }
}