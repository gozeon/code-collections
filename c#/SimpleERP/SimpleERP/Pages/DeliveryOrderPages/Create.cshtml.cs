using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SimpleERP.Data;
using SimpleERP.Services;
using System.ComponentModel.DataAnnotations;

namespace SimpleERP.Pages.DeliveryOrderPages;

public class CreateModel : PageModel
{
    private readonly ApplicationDbContext _context;
    private readonly IIdGeneratorService _idGeneratorService;

    public CreateModel(ApplicationDbContext context, IIdGeneratorService idGeneratorService)
    {
        _context = context;
        _idGeneratorService = idGeneratorService;
    }

    public IActionResult OnGet()
    {
        DeliveryOrderVM.Details.Add(new DeliveryOrderDetailVM());
        return Page();
    }

    [BindProperty]
    public DeliveryOrderVM DeliveryOrderVM { get; set; } = new();

    // To protect from overposting attacks, see https://aka.ms/RazorPagesCRUD.
    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }

        string yearMonth = DeliveryOrderVM.DeliveryTime.HasValue ? DeliveryOrderVM.DeliveryTime.Value.ToString("yyyyMM") : DateTime.Now.ToString("yyyyMM");
        string id = await _idGeneratorService.GetNextIdAsync();

        var newOrder = new DeliveryOrder
        {
            Id = id,
            CreateTime = DateTime.Now,
            YearMonth = yearMonth,

            Remark = DeliveryOrderVM.Remark,
            Consignee = DeliveryOrderVM.Consignee ?? string.Empty,
            Address = DeliveryOrderVM.Address ?? string.Empty,
            DeliveryTime = DeliveryOrderVM.DeliveryTime,

            Details = new List<DeliveryOrderDetail>()
        };

        foreach (var detailVM in DeliveryOrderVM.Details)
        {
            var detailItem = new DeliveryOrderDetail
            {
                OrderId = id,
                ProductName = detailVM.Name ?? string.Empty,
                SkuSpecification = detailVM.Sku,
                Price = detailVM.Price,
                Quantity = detailVM.Quantity
            };

            newOrder.Details.Add(detailItem);
        }

        newOrder.TotalAmount = newOrder.Details.Sum(d => d.SubTotal);

        _context.DeliveryOrders.Add(newOrder);
        await _context.SaveChangesAsync();

        return RedirectToPage("./Index");
    }

    public IActionResult OnGetDetailRowPartial()
    {
        return Partial("_DeliveryOrderDetailVmPartial", new DeliveryOrderDetailVM());
    }
}

public class DeliveryOrderVM
{
    public DateTime? DeliveryTime { get; set; }
    public string? Remark { get; set; }
    public string? Consignee { get; set; } = string.Empty;
    public string? Address { get; set; } = string.Empty;

    public List<DeliveryOrderDetailVM> Details { get; set; } = new();
}

public class DeliveryOrderDetailVM
{
    public string? Name { get; set; }

    [Required(ErrorMessage = "必填项")]
    public string Sku { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int Quantity { get; set; }

}