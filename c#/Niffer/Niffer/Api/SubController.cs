using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Niffer.Data;
using NuGet.Protocol.Core.Types;
using System.Text;

namespace Niffer.Api
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class SubController : ControllerBase
    {
        private readonly Niffer.Data.ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<SubController> _logger;
        private readonly IWebHostEnvironment _env;
        public SubController(Niffer.Data.ApplicationDbContext applicationDbContext, UserManager<IdentityUser> userManager, IHttpClientFactory httpClientFactory, IConfiguration configuration, ILogger<SubController> logger, IWebHostEnvironment env)
        {
            _context = applicationDbContext;
            _userManager = userManager;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
            _env = env;
        }

        //拦截controller下所有，但是不支持热重载
        //public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        //{
        //    if (context.ActionArguments.TryGetValue("userId", out var userIdObj) && userIdObj is string userId)
        //    {
        //        var userValid = await IsUserValidAsync(userId);
        //        if(!userValid)
        //        {
        //            context.Result = new NotFoundObjectResult(new { message = $"未找到用户: {userId}" });
        //            return;
        //        }
        //    } 
        //    else
        //    {
        //        // 如果某条路由忘记写 userId 参数，为了安全，默认予以拦截拒绝
        //        context.Result = new BadRequestObjectResult(new { message = "请求缺少必需的 userId 参数。" });
        //        return;
                
        //    }

        //    await base.OnActionExecutionAsync(context, next);
        //}


        [HttpGet("s/{userId}")]
        public async Task<IActionResult> ExportUserUrls([FromRoute] string userId)
        {
            //bool userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            //if(!userExists)
            //{
            //    return NotFound();
            //}

            //var sub = await _context.UserSubscriptions.FirstOrDefaultAsync(s => s.UserId == userId);
            //if (sub != null)
            //{
            //    if(sub.SubscriptionExpiry < DateTime.Now)
            //    {
            //        return NotFound();
            //    }
            //}


            var urls = await _context.Subscriptions.AsNoTracking().Select(l => l.Url).ToListAsync();

            string joinedText = string.Join("\r\n", urls);

            byte[] bytes = Encoding.UTF8.GetBytes(joinedText);
            string base64Result = Convert.ToBase64String(bytes);

            return Content(base64Result, "text/plain", Encoding.UTF8);
        }

        [HttpGet("told/{userId}")]
        public async Task<IActionResult> TestUserAgentOld([FromRoute] string userId)
        {
            string targetType = "v2ray";
            string userAgent = Request.Headers["User-Agent"].ToString();

            if(!string.IsNullOrEmpty(userAgent))
            {
                if(userAgent.Contains("clash", StringComparison.OrdinalIgnoreCase))
                {
                    targetType = "clash";
                }

                if (userAgent.Contains("sing-box", StringComparison.OrdinalIgnoreCase))
                {
                    targetType = "singbox";
                }
            }

            _logger.LogInformation("uid: {userId}, target: {targetType}, ua: {userAgent}", userId, targetType, userAgent);

            if(targetType == "v2ray")
            {
                return RedirectToAction("ExportUserUrls", new { userId = userId });
            }

            try
            {
                // https://github.com/asdlokj1qpi233/subconverter/
                // docker run --rm -p 25500:25500 asdlokj1qpi23/subconverter:latest
                // https://github.com/MetaCubeX/subconverter
                // docker run  --rm -p 25400:25500 ghcr.io/metacubex/subconverter:latest
                string? subconverterBaseUrl = _configuration["ProxySubscriptionSettings:SubconverterBaseUrl"]?.TrimEnd('/');
                string? externalApiBaseUrl = _configuration["ProxySubscriptionSettings:ExternalApiBaseUrl"]?.TrimEnd('/');

                string subRawUrl = $"{externalApiBaseUrl}/api/Sub/s/{userId}";
                _logger.LogInformation("sub url: {}", subRawUrl);

                string encodedTargetUrl = System.Net.WebUtility.UrlEncode(subRawUrl);

                string subconvertUrl = $"{subconverterBaseUrl}/sub?target={targetType}&url={encodedTargetUrl}";
                _logger.LogInformation("subconverter url: {}", subconvertUrl);

                var client = _httpClientFactory.CreateClient();
                string base64Response = await client.GetStringAsync(subconvertUrl);
                return Content(base64Response, "text/plain", Encoding.UTF8);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return NotFound();
            }
        }

        [HttpGet("t/{userId}")]
        public async Task<IActionResult> TestUserAgent([FromRoute] string userId)
        {
            var userValid = await IsUserValidAsync(userId);
            if (!userValid)
            {
                return NotFound();
            }
            string userAgent = (Request.Headers.UserAgent.ToString() ?? "").ToLower();
            _logger.LogInformation("uid: {userId}, ua: {userAgent}", userId, userAgent);

            string fileName = "v2ray.txt";
            string contentType = "text/plain; charset=utf-8";
            string downloadName = _configuration["ProxySubscriptionSettings:Name"] ?? "Niffer";

            if (userAgent.Contains("clash") || userAgent.Contains("mihomo") || userAgent.Contains("verge"))
            {
                // Routing to Clash Meta / Mihomo
                fileName = "clash.yaml";
                contentType = "text/yaml; charset=utf-8";
            }

            if (userAgent.Contains("sing-box") || userAgent.Contains("nekobox") || userAgent.Contains("sfi"))
            {
                // Routing to Sing-Box
                fileName = "sing-box.json";
                contentType = "application/json; charset=utf-8";
            }

            string filePath = Path.Combine(_env.ContentRootPath, "Configs", fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("Configuration profile temporarily unavailable.");
            }

            _logger.LogInformation("current fileName: {fileName}", fileName);

            Response.Headers.Append("Profile-Title", downloadName);
            return PhysicalFile(filePath, contentType, downloadName);
        }

        [HttpGet("p/{userId}")]
        public async Task<IActionResult> MirrorUserSub([FromRoute] string userId)
        {
            var client = _httpClientFactory.CreateClient();
            if (Request.Headers.TryGetValue("User-Agent", out var ua))
            {
                client.DefaultRequestHeaders.UserAgent.Clear();
                client.DefaultRequestHeaders.TryAddWithoutValidation("User-Agent", ua.ToString());

                _logger.LogInformation(ua.ToString());
            }
            var url = _configuration["ProxySubscriptionSettings:RemoteSubUrl"];
            if(string.IsNullOrEmpty(url))
            {
                return NotFound();
            }
            string base64Response = await client.GetStringAsync("https://liangxin.xyz/api/v1/liangxin?OwO=7559e534a0109703ba0a624883e501eb");
            return Content(base64Response, "text/plain", Encoding.UTF8);
        }


        [NonAction] // swagger不生成doc
        private async Task<bool> IsUserValidAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return false;
            }

            var user = await _userManager.FindByIdAsync(userId);
            if(user == null)
            {
                return false;
            }

            var sub = await _context.UserSubscriptions.FirstOrDefaultAsync(s => s.UserId == user.Id);
            if (sub != null)
            {
                if (sub.SubscriptionExpiry < DateTime.Now)
                {
                    return false;
                }
            }

            return true;
        }
    }
}
