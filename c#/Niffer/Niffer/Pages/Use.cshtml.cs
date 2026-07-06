using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Niffer.Pages
{
    [Authorize]
    public class UseModel : PageModel
    {
        public void OnGet()
        {
        }
    }
}
