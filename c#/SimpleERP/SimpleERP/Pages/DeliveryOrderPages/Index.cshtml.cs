using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SimpleERP.Data;
using SimpleERP.Services;
using X.PagedList;
using X.PagedList.Extensions;

namespace SimpleERP.Pages.DeliveryOrderPages;

public class IndexModel : PageModel
{
    private readonly ApplicationDbContext _context;
    private readonly IDeliveryOrderPdfService _pdfService;

    public IndexModel(ApplicationDbContext context, IDeliveryOrderPdfService deliveryOrderPdfService)
    {
        _context = context;
        _pdfService = deliveryOrderPdfService;
    }

    [BindProperty(SupportsGet = true)]

    public string SearchId { get; set; } = default!;

    [BindProperty(SupportsGet = true)]
    public int PageSize { get; set; } = 10;


    public IPagedList<DeliveryOrder> DeliveryOrdersPagedList { get; set; } = default!;

    public async Task OnGetAsync(int? pageIndex, string searchId)
    {
        var pageNumber = pageIndex ?? 1;
        SearchId = searchId;

        var query = _context.DeliveryOrders.AsNoTracking();

        if (!string.IsNullOrEmpty(SearchId))
        {
            query = query.Where(o => o.Id == SearchId.Trim());
        }
        DeliveryOrdersPagedList = query.OrderByDescending(o => o.CreateTime).ToPagedList(pageNumber, PageSize);
    }

    public async Task<IActionResult> OnPostExportPdfAsync(List<string> OrderIds)
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

    public async Task<IActionResult> OnPostMockData()
    {
        var random = new Random();
        var mockProducts = new List<(string Name, string Sku, decimal Price)>
        {
            ("滑动支架", "PRN-A1-BLK", 1280.00m),
            ("普通支架", "130cm x 30cm x 140cm", 99.00m),
            ("隔热支架", "MON-4K-27", 2499.50m),
            ("保冷支架", "30cm x 30cm x 40cm", 680.00m),
            ("管托", "30cm x 320cm x 40cm", 329.00m),
        };

        var mockNames = new[] { "张伟", "王芳", "李娜", "刘洋", "陈杰", "杨兵", "黄丽", "赵敏" };
        var mockAddresses = new[] { "河北兴欧管道", "北京市朝阳区高新科技园A座", "上海市浦东新区张江路789号", "广州市天河区天河路123号", "深圳市南山区科技园腾讯大道", "成都市高新区天府软件园C区" };

        // 设置生成的时间范围：从 2025 年 1 月 1 日开始
        var startDate = new DateTime(2025, 1, 1);
        // 当前时间是 2026 年 7 月
        var endDate = DateTime.Now;
        var currentMonthStart = new DateTime(startDate.Year, startDate.Month, 1);

        // 按照月份遍历
        while (currentMonthStart <= endDate)
        {
            string yearMonthStr = currentMonthStart.ToString("yyyyMM");
            // 每个月随机生成 4 到 8 张订单，确保满足“至少4单”的要求
            int ordersInMonth = random.Next(4, 9);

            for(int i = 0; i < ordersInMonth; i++)
            {
                // 在该月份内随机产生一天
                int daysInMonth = DateTime.DaysInMonth(currentMonthStart.Year, currentMonthStart.Month);
                int randomDay = random.Next(1, daysInMonth + 1);
                // 确保生成的日期不会超过当前的真实时间
                var orderDate = new DateTime(currentMonthStart.Year, currentMonthStart.Month, randomDay);
                if (orderDate > endDate) continue;
                string uniqueOrderId = $"DO-{yearMonthStr}-{Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper()}";

                var newOrder = new DeliveryOrder
                {
                    Id = uniqueOrderId,
                    YearMonth = yearMonthStr,
                    CreateTime = orderDate.AddHours(random.Next(8, 18)), // 模拟工作时间创建
                    DeliveryTime = orderDate.AddDays(random.Next(0, 3)), // 0到3天内发货
                    Remark = random.Next(0, 3) == 0 ? "客户要求加急发货" : "正常排单出库",
                    Consignee = mockNames[random.Next(mockNames.Length)],
                    Address = mockAddresses[random.Next(mockAddresses.Length)],
                    Details = new List<DeliveryOrderDetail>()
                };

                // 为每张发货单随机创建 1 到 4 条商品明细
                int detailsCount = random.Next(1, 5);
                // 随机洗牌物料库，确保单张订单内的商品不重复
                var selectedProducts = mockProducts.OrderBy(x => random.Next()).Take(detailsCount).ToList();

                foreach (var prod in selectedProducts)
                {
                    int qty = random.Next(1, 6); // 每个商品随机买 1 到 5 件

                    var detailItem = new DeliveryOrderDetail
                    {
                        OrderId = uniqueOrderId,
                        ProductName = prod.Name,
                        SkuSpecification = prod.Sku,
                        Price = prod.Price,
                        Quantity = qty
                    };

                    newOrder.Details.Add(detailItem);
                }

                newOrder.TotalAmount = newOrder.Details.Sum(o => o.SubTotal);
                _context.DeliveryOrders.Add(newOrder);
            }
            
            currentMonthStart = currentMonthStart.AddMonths(1);
        }
        await _context.SaveChangesAsync();

        return RedirectToPage();
    }

    public async Task<IActionResult> OnPostClearData()
    {
        await _context.DeliveryOrders.ExecuteDeleteAsync();
        return RedirectToPage();
    }
}
