using UserProfileApi.Models;
using UserProfileApi.Services;

namespace UserProfileApi.Interfaces
{
    public interface IRuleService
    {
        string GetMinimalRulesPrompt();
        ComplianceRule? GetRuleById(string id);
    }
}
