using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Niffer.Data;
using System.Text;

namespace Niffer.Pages
{
    [Authorize]
    public class ProfileModel : PageModel
    {
        private readonly Niffer.Data.ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        public ProfileModel(Niffer.Data.ApplicationDbContext applicationDbContext, UserManager<IdentityUser> userManager)
        {
            _context = applicationDbContext;
            _userManager = userManager;
        }

        public IdentityUser CurrentUser { get; set; } = default!;
        public UserSubscription CurrentUserSubscription { get; set; } = default!;
        public async Task<IActionResult> OnGetAsync()
        {
            IdentityUser? _identityUser = await _userManager.GetUserAsync(User);
            if(_identityUser == null)
            {
                return NotFound();
            }
            CurrentUser = _identityUser;

            var sub = await _context.UserSubscriptions.FirstOrDefaultAsync(s => s.UserId == CurrentUser.Id);
            if(sub!=null)
            {
                CurrentUserSubscription = sub;
            }
            
            
            return Page();

        }

    }
}
