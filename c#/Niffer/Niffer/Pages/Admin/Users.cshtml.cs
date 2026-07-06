using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Niffer.Data;
using System.Collections;
using System.ComponentModel.DataAnnotations;

namespace Niffer.Pages.Admin
{
    public class UsersModel : PageModel
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _context;

        public UsersModel(UserManager<IdentityUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        public class UserDisplayDto
        {
            public string Id { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public DateTime? Expiry { get; set; }
        }

        public class AddUserInputModel
        {
            [Required, EmailAddress]
            public string Email { get; set; } = string.Empty;

            [Required, DataType(DataType.Date)]
            public DateTime SubscriptionExpiry { get; set; }
        }

        public IList<UserDisplayDto> SystemUsers { get; set; } = default!;

        [BindProperty]
        public AddUserInputModel NewUser { get; set; } = new();

        private async Task LoadDataAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            var subs = await _context.UserSubscriptions.ToListAsync();

            SystemUsers = users.Select(u =>
            {
                var sub = subs.FirstOrDefault(s => s.UserId == u.Id);
                return new UserDisplayDto
                {
                    Id = u.Id,
                    Email = u?.Email ?? "",
                    Expiry = sub?.SubscriptionExpiry
                };
            }).ToList();

            await Task.CompletedTask;
        }

        public async Task OnGetAsync()
        {
            //var users = await _userManager.Users.ToListAsync();
            //var subs = await _context.UserSubscriptions.ToListAsync();
            //SystemUsers = (from u in users
            //               join s in subs on u.Id equals s.UserId into joined
            //               from sub in joined.DefaultIfEmpty()
            //               select new UserDisplayDto
            //               {
            //                   Id = u.Id,
            //                   Email = u.Email ?? "",
            //                   Expiry = sub.SubscriptionExpiry
            //               }).ToList();
            //SystemUsers = users.Select(u =>
            //{
            //    var sub = subs.FirstOrDefault(s => s.UserId == u.Id);
            //    return new UserDisplayDto
            //    {
            //        Id = u.Id,
            //        Email = u?.Email ?? "",
            //        Expiry = sub?.SubscriptionExpiry
            //    };
            //}).ToList();
            await LoadDataAsync();
        }
    

        public async Task<IActionResult> OnPostAddAdminAsync()
        {
            return await SaveUserAsync(isAdmin: true);
        }

        public async Task<IActionResult> OnPostAddUserAsync()
        {
            return await SaveUserAsync(isAdmin: false);
        }

        private async Task<IActionResult> SaveUserAsync(bool isAdmin)
        {
            if (!ModelState.IsValid)
            {
                await LoadDataAsync();
                return Page();
            }

            var user = new IdentityUser
            {
                UserName = NewUser.Email,
                Email = NewUser.Email,
                EmailConfirmed = true,
            };
            string defaultPassword = "UserPassword123!";
            var result = await _userManager.CreateAsync(user, defaultPassword);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }

                await OnGetAsync();
                return Page();
            }

            if (isAdmin)
            {
                await _userManager.AddToRoleAsync(user, "Admin");
            } 
            else
            {
                //用户创建成功后，往独立的关联表里插入到期时间
                var subscription = new UserSubscription
                {
                    UserId = user.Id,
                    SubscriptionExpiry = NewUser.SubscriptionExpiry
                };

                _context.UserSubscriptions.Add(subscription);
            }
           
            await _context.SaveChangesAsync();

            return RedirectToPage();
        }

        public async Task<IActionResult> OnPostUpdateExpiryAsync(string userId, DateTime newExpiry)
        {
            var sub = await _context.UserSubscriptions.FirstOrDefaultAsync(s => s.UserId == userId);
            if(sub!=null)
            {
                sub.SubscriptionExpiry = newExpiry;
            }
            else
            {
                var newSub = new UserSubscription
                {
                    UserId = userId,
                    SubscriptionExpiry = newExpiry
                };
                _context.UserSubscriptions.Add(newSub);
            }
            await _context.SaveChangesAsync();

            return new JsonResult(new
            {
                success = true,
                message = "ok"

            });
        }

        
        public async Task<IActionResult> OnPostDeleteUserAsync(string userId)
        {
            var userToDel = await _userManager.FindByIdAsync(userId);
            if(userToDel == null)
            {
                return NotFound();
            }

            var isTargetAdmin = await _userManager.IsInRoleAsync(userToDel, "Admin");
            if(isTargetAdmin)
            {
                return BadRequest("管理员无法被删除!");
            }

            var result = await _userManager.DeleteAsync(userToDel);
            if(!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            return RedirectToPage();
        }
    }
}
