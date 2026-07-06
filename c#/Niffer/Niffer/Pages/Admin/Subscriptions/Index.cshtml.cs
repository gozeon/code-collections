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
    public class IndexModel : PageModel
    {
        private readonly Niffer.Data.ApplicationDbContext _context;

        public IndexModel(Niffer.Data.ApplicationDbContext context)
        {
            _context = context;
        }

        public IList<Subscription> Subscription { get;set; } = default!;

        public async Task OnGetAsync()
        {
            Subscription = await _context.Subscriptions.ToListAsync();
        }
    }
}
