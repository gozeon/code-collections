using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SimpleERP.Data;

namespace SimpleERP.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public decimal OverallTotalAmount { get; set; }
        public int OverallTotalOrders { get; set; }
        public List<string> MonthlyLabels { get; set; } = new();
        public List<decimal> MonthlyAmounts { get; set; } = new();
        public List<int> MonthlyCounts { get; set; } = new();

        public List<string> YearlyLabels { get; set; } = new();
        public List<decimal> YearlyAmounts { get; set; } = new();

        public List<string> QuarterXLabels { get; set; } = new() { "第一季度 (Q1)", "第二季度 (Q2)", "第三季度 (Q3)", "第四季度 (Q4)" };
        public List<decimal> QuarterAmounts2025 { get; set; } = new() { 0, 0, 0, 0 };
        public List<decimal> QuarterAmounts2026 { get; set; } = new() { 0, 0, 0, 0 };

        public async Task OnGetAsync()
        {
            var rawData = await _context.DeliveryOrders
                .Where(o => o.DeliveryTime != null)
                .Select(o => new { o.YearMonth, o.TotalAmount })
                .ToListAsync();

            OverallTotalAmount = rawData.Sum(s => s.TotalAmount);
            OverallTotalOrders = rawData.Count;

            // 月度聚合
            var monthlyGroup = rawData
                .GroupBy(o => o.YearMonth)
                .Select(g => new
                {
                    Key = g.Key,
                    Label = $"{g.Key.Substring(0, 4)}-{g.Key.Substring(4, 2)}",
                    Amount = g.Sum(x => x.TotalAmount),
                    Count = g.Count(),
                })
                .OrderBy(x => x.Label) // 保证折线图从左到右按时间轴流转
                .ToList();

            // 取最近12个月的
            var last12Months = monthlyGroup.Skip(Math.Max(0, monthlyGroup.Count - 12)).ToList();

            MonthlyLabels = last12Months.Select(x => x.Label).ToList();
            MonthlyAmounts = last12Months.Select(x => x.Amount).ToList();
            MonthlyCounts = last12Months.Select(x => x.Count).ToList();

            // 季度聚合
            //var quarterGroup = rawData
            //    .GroupBy(o =>
            //    {
            //        string year = o.YearMonth.Substring(0, 4);
            //        string month = o.YearMonth.Substring(4, 2);
            //        string quarter = month switch
            //        {
            //            "01" or "02" or "03" => "Q1",
            //            "04" or "05" or "06" => "Q2",
            //            "07" or "08" or "09" => "Q3",
            //            _ => "Q4"
            //        };
            //        return $"{year} {quarter}";
            //    })
            //    .Select(g => new { Label = g.Key, Amount = g.Sum(x => x.TotalAmount) })
            //    .OrderBy(x => x.Label)
            //    .ToList();

            //QuarterLabels = quarterGroup.Select(x => x.Label).ToList();
            //QuarterAmounts = quarterGroup.Select(x => x.Amount).ToList();

            foreach (var item in rawData)
            {
                string year = item.YearMonth.Substring(0, 4);
                string month = item.YearMonth.Substring(4, 2);

                // 确定其属于第几个索引 (Q1=0, Q2=1, Q3=2, Q4=3)
                int quarterIndex = month switch
                {
                    "01" or "02" or "03" => 0,
                    "04" or "05" or "06" => 1,
                    "07" or "08" or "09" => 2,
                    _ => 3
                };

                // 根据年份，分别累加到对应的季度数组槽位中
                if (year == "2025")
                {
                    QuarterAmounts2025[quarterIndex] += item.TotalAmount;
                }
                else if (year == "2026")
                {
                    QuarterAmounts2026[quarterIndex] += item.TotalAmount;
                }
            }

            // 年度聚合 (取前4位 "2025")
            var yearlyGroup = rawData
                .GroupBy(o => o.YearMonth.Substring(0, 4))
                .Select(g => new { Label = $"{g.Key}年", Amount = g.Sum(x => x.TotalAmount) })
                .OrderBy(x => x.Label)
                .ToList();

            YearlyLabels = yearlyGroup.Select(x => x.Label).ToList();
            YearlyAmounts = yearlyGroup.Select(x => x.Amount).ToList();
        }
    }
}
