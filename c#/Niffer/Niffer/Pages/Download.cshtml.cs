using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Niffer.Pages
{
    [Authorize]
    public class DownloadModel : PageModel
    {
        public void OnGet()
        {
        }
    }
}
