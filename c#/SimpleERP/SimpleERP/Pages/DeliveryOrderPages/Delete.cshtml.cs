using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SimpleERP.Data;

namespace SimpleERP.Pages.DeliveryOrderPages;

public class DeleteModel : PageModel
{
    private readonly ApplicationDbContext _context;

    public DeleteModel(ApplicationDbContext context)
    {
        _context = context;
    }

    [BindProperty]
    public DeliveryOrder DeliveryOrder { get; set; } = default!;

    public async Task<IActionResult> OnGetAsync(string? id)
    {
        if (id is null)
        {
            return NotFound();
        }

        var deliveryorder = await _context.DeliveryOrders.FirstOrDefaultAsync(m => m.Id == id);
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

    public async Task<IActionResult> OnPostAsync(string? id)
    {
        if (id is null)
        {
            return NotFound();
        }

        var deliveryorder = await _context.DeliveryOrders.FindAsync(id);
        if (deliveryorder != null)
        {
            DeliveryOrder = deliveryorder;
            _context.DeliveryOrders.Remove(DeliveryOrder);
            await _context.SaveChangesAsync();
        }

        return RedirectToPage("./Index");
    }
}
