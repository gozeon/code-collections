using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SimpleERP.Data;
using SimpleERP.Services;

namespace SimpleERP.Pages.DeliveryOrderPages
{
    public class ExportPdfModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        private readonly IDeliveryOrderPdfService _pdfService;

        public ExportPdfModel(ApplicationDbContext context, IDeliveryOrderPdfService pdfService)
        {
            _context = context;
            _pdfService = pdfService;
        }
        public void OnGet()
        {
            RedirectToPage("/Index");
        }

        [BindProperty]
        public List<string> OrderIds { get; set; } = default!;

        public async Task<IActionResult> OnPostAsync()
        {
            if (OrderIds == null || !OrderIds.Any())
            {
                return BadRequest("请至少选择一个订单进行导出。");
            }

            // 从数据库中查出完整的订单主表及相关的商品 Details 明细
            var orders = await _context.DeliveryOrders
                .Include(o => o.Details)
                .Where(o => OrderIds.Contains(o.Id))
                .Where(o => o.DeliveryTime != null)
                .ToListAsync();

            if (!orders.Any())
            {
                return NotFound("未找到对应的订单数据。");
            }

            // 调用刚刚写好的 PDF 服务生成二进制字节流
            byte[] pdfBytes = _pdfService.GenerateOrdersPdf(orders);

            // 返回给前端二进制文件流（横向导出的 PDF 文件）
            string fileName = $"发货单_{DateTime.Now:yyyyMMddHHmmss}.pdf";
            return File(pdfBytes, "application/pdf", fileName);
        }
    }
}
