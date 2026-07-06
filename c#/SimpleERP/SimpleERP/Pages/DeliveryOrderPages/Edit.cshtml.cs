using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SimpleERP.Data;

namespace SimpleERP.Pages.DeliveryOrderPages;

public class EditModel : PageModel
{
    private readonly ApplicationDbContext _context;

    public EditModel(ApplicationDbContext context)
    {
        _context = context;
    }

    [BindProperty]
    public DeliveryOrder DeliveryOrder { get; set; } = default!;

    [BindProperty]
    public DeliveryOrderVM DeliveryOrderVM { get; set; } = new();

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
        DeliveryOrder = deliveryorder;

        DeliveryOrderVM.Consignee = deliveryorder.Consignee;
        DeliveryOrderVM.Address = deliveryorder.Address;
        DeliveryOrderVM.Remark = deliveryorder.Remark;
        DeliveryOrderVM.DeliveryTime = deliveryorder.DeliveryTime;

        foreach(var item in deliveryorder.Details)
        {
            var detailVM = new DeliveryOrderDetailVM
            {
                Name = item.ProductName,
                Sku = item.SkuSpecification,
                Price = item.Price,
                Quantity = item.Quantity,
            };
            DeliveryOrderVM.Details.Add(detailVM);
        }

        return Page();
    }

    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see https://aka.ms/RazorPagesCRUD.
    public async Task<IActionResult> OnPostAsync()
    {
        ModelState.Remove("DeliveryOrder.YearMonth");
        if (!ModelState.IsValid)
        {
            return Page();
        }

        _context.Attach(DeliveryOrder).State = EntityState.Modified;

        string yearMonth = DeliveryOrderVM.DeliveryTime.HasValue ? DeliveryOrderVM.DeliveryTime.Value.ToString("yyyyMM") : DateTime.Now.ToString("yyyyMM");

        DeliveryOrder.Consignee = DeliveryOrderVM.Consignee ?? string.Empty;
        DeliveryOrder.Address = DeliveryOrderVM.Address ?? string.Empty;
        DeliveryOrder.Remark = DeliveryOrderVM.Remark;
        DeliveryOrder.DeliveryTime = DeliveryOrderVM.DeliveryTime;
		DeliveryOrder.YearMonth = yearMonth;


        // 删除所有旧的details
        var oldDetails = _context.DeliveryOrderDetails.Where(d => d.OrderId == DeliveryOrder.Id);
        _context.DeliveryOrderDetails.RemoveRange(oldDetails);
        // 效果一样
        //await _context.DeliveryOrderDetails.Where(d => d.OrderId == DeliveryOrder.Id).ExecuteDeleteAsync();


        DeliveryOrder.Details.Clear();
        foreach (var detailVM in DeliveryOrderVM.Details)
        {
            var detailItem = new DeliveryOrderDetail
            {
                OrderId = DeliveryOrder.Id,
                ProductName = detailVM.Name ?? string.Empty,
                SkuSpecification = detailVM.Sku,
                Price = detailVM.Price,
                Quantity = detailVM.Quantity
            };

            DeliveryOrder.Details.Add(detailItem);
        }

        DeliveryOrder.TotalAmount = DeliveryOrder.Details.Sum(d => d.SubTotal);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!DeliveryOrderExists(DeliveryOrder.Id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return RedirectToPage("./Index");
    }

    private bool DeliveryOrderExists(string id)
    {
        return _context.DeliveryOrders.Any(e => e.Id == id);
    }
}
