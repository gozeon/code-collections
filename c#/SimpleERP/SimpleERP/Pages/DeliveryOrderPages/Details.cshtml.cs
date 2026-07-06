using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SimpleERP.Data;

namespace SimpleERP.Pages.DeliveryOrderPages;

public class DetailsModel : PageModel
{
    private readonly ApplicationDbContext _context;
    public DetailsModel(ApplicationDbContext context)
    {
        _context = context;
    }

    public DeliveryOrder DeliveryOrder { get; set; } = default!;

    public async Task<IActionResult> OnGetAsync(string? id)
    {
        if (id is null)
        {
            return NotFound();
        }

        var deliveryorder = await _context.DeliveryOrders.Include(m => m.Details).FirstOrDefaultAsync(m => m.Id == id);
        if (deliveryorder is null)
        {
            return NotFound();
        }
        else
        {
            DeliveryOrder = deliveryorder;
        }

        return Page();
    }
}
