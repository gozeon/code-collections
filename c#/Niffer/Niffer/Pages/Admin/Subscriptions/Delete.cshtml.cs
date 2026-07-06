using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Niffer.Data;

namespace Niffer.Pages.Admin.Subscriptions
{
    public class DeleteModel : PageModel
    {
        private readonly Niffer.Data.ApplicationDbContext _context;

        public DeleteModel(Niffer.Data.ApplicationDbContext context)
        {
            _context = context;
        }

        [BindProperty]
        public Subscription Subscription { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var subscription = await _context.Subscriptions.FirstOrDefaultAsync(m => m.Id == id);

            if (subscription is not null)
            {
                Subscription = subscription;

                return Page();
            }

            return NotFound();
        }

        public async Task<IActionResult> OnPostAsync(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var subscription = await _context.Subscriptions.FindAsync(id);
            if (subscription != null)
            {
                Subscription = subscription;
                _context.Subscriptions.Remove(Subscription);
                await _context.SaveChangesAsync();
            }

            return RedirectToPage("./Index");
        }
    }
}
