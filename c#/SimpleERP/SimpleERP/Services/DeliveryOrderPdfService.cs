using Microsoft.EntityFrameworkCore.Metadata.Internal;
using QuestPDF.Drawing;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SimpleERP.Data;

namespace SimpleERP.Services
{
    public interface IDeliveryOrderPdfService
    {
        byte[] GenerateOrdersPdf(List<DeliveryOrder> selectedOrders);
    }

    public class DeliveryOrderPdfService : IDeliveryOrderPdfService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        public DeliveryOrderPdfService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public byte[] GenerateOrdersPdf(List<DeliveryOrder> selectedOrders)
        {
            // 注册 QuestPDF 社区许可证
            QuestPDF.Settings.License = LicenseType.Community;
            QuestPDF.Settings.FontDiscoveryPaths.Clear();

            string webRootPath = _webHostEnvironment.WebRootPath;
            string fontPath = Path.Combine(webRootPath, "fonts");
            QuestPDF.Settings.FontDiscoveryPaths.Add(fontPath);

            QuestPDF.Settings.CheckIfAllTextGlyphsAreAvailable = false;
            // 在内存流中生成 PDF
            using var stream = new MemoryStream();

            Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.DefaultTextStyle(text => text.FontFamily("思源宋体"));
                    // 1. 设置 A4 纸张 ＆ 横向布局 (Landscape)
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(1.5f, Unit.Centimetre);
                    // 2. 设置全局默认字体
                    page.DefaultTextStyle(x => x.FontSize(12f));


                    page.Header().Row(row =>
                    {
                        row.RelativeItem().Column(column =>
                        {
                            column.Item().Text("河北兴欧管道有限公司").FontSize(8);
                            column.Item().Text("+86 177-1232-1234").FontSize(8);
                        });

                        if(selectedOrders.Count > 1)
                        {
                            row.ConstantItem(100).AlignRight().Text(text => {
                                text.CurrentPageNumber().FontSize(8);
                                text.Span(" / ").FontSize(8);
                                text.TotalPages().FontSize(8);
                            });
                        } 
                    });

                    // 4. 核心内容绘制
                    page.Content().Column(column =>
                    {
                        // 场景一：勾选了多个订单 -> 第一页强制生成【明细汇总主表】
                        if (selectedOrders.Count > 1)
                        {
                            BuildSummaryPage(column, selectedOrders);
                            column.Item().PageBreak(); // 强制分页，后续详情另起一页
                        }

                        // 场景二 / 多单后续：循环绘制每个订单的商品独立详情
                        for (int i = 0; i < selectedOrders.Count; i++)
                        {
                            BuildOrderDetailSection(column, selectedOrders[i]);

                            // 如果不是最后一单，单与单之间强制分页
                            if (i < selectedOrders.Count - 1)
                            {
                                column.Item().PageBreak();
                            }
                        }
                    });
                });
            }).GeneratePdf(stream);

            return stream.ToArray();
        }

        // 绘制多订单的第一页汇总表
        private void BuildSummaryPage(ColumnDescriptor column, List<DeliveryOrder> orders)
        {
            column.Item().PaddingBottom(20).Text("发货单明细汇总表").FontSize(20).Bold().AlignCenter();

            column.Item().Table(table =>
            {
                IContainer DefaultCellStyle(IContainer container, string backgroundColor)
                {
                    return container
                        .Border(1)
                        .BorderColor(Colors.Grey.Lighten1)
                        .Background(backgroundColor)
                        .PaddingVertical(5)
                        .PaddingHorizontal(10)
                        .AlignCenter()
                        .AlignMiddle();
                }

                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn();
                    columns.RelativeColumn(); 
                    columns.RelativeColumn();    
                    columns.RelativeColumn(); 
                    columns.RelativeColumn();
                });

                table.Header(header =>
                {

                    header.Cell().Element(HeaderCellStyle).Text("订单ID");
                    header.Cell().Element(HeaderCellStyle).Text("收货人");
                    header.Cell().Element(HeaderCellStyle).Text("收货地址");
                    header.Cell().Element(HeaderCellStyle).Text("发货日期");
                    header.Cell().Element(HeaderCellStyle).Text("订单金额");

                    IContainer HeaderCellStyle(IContainer container) => DefaultCellStyle(container, Colors.Grey.Lighten3);

                });

                foreach (var order in orders)
                {
                    table.Cell().Element(CellStyle).Text(order.Id);
                    table.Cell().Element(CellStyle).Text(order.Consignee);
                    table.Cell().Element(CellStyle).Text(order.Address);
                    table.Cell().Element(CellStyle).Text(order.DeliveryTime?.ToString("yyyy-MM-dd"));
                    table.Cell().Element(CellStyle).Text(order.TotalAmount.ToString("C").Replace('¥', '￥'));

                    IContainer CellStyle(IContainer container) => DefaultCellStyle(container, Colors.White);
                }

                table.Cell().ColumnSpan(5).Element(FootCellStyle).PaddingVertical(10).AlignCenter().Text($"共   {orders.Count()}   单，总金额:   {orders.Sum(m => m.TotalAmount).ToString("C").Replace('¥', '￥')}").Bold();
                IContainer FootCellStyle(IContainer container) => DefaultCellStyle(container, Colors.White);

            });
        }

        // 绘制单个订单详情
        private void BuildOrderDetailSection(ColumnDescriptor column, DeliveryOrder order)
        {
            column.Item().PaddingBottom(20).Text("发货单明细").FontSize(20).Bold().AlignCenter();

            column.Item().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.ConstantColumn(2.2f, Unit.Centimetre);
                    columns.RelativeColumn();

                    columns.ConstantColumn(2.2f, Unit.Centimetre);
                    columns.RelativeColumn();

                    columns.ConstantColumn(2.2f, Unit.Centimetre);
                    columns.RelativeColumn();

                });
                table.Cell().Padding(4).Text("单号:").Bold();
                table.Cell().Padding(4).Text(order.Id);

                table.Cell().Padding(4).Text("发货日期:").Bold();
                table.Cell().Padding(4).Text(order.DeliveryTime?.ToString("yyyy-MM-dd"));

                table.Cell().Padding(4).Text("金额:").Bold();
                table.Cell().Padding(4).Text(order.TotalAmount.ToString("C").Replace('¥', '￥'));

                table.Cell().Padding(4).Text("收货人:").Bold();
                table.Cell().Padding(4).Text(order.Consignee ?? "-");

                table.Cell().Padding(4).Text("收货地址:").Bold();
                table.Cell().ColumnSpan(3).Padding(4).Text(order.Address ?? "-");
            });

            column.Item().Table(table =>
            {
                IContainer DefaultCellStyle(IContainer container, string backgroundColor)
                {
                    return container
                        .Border(1)
                        .BorderColor(Colors.Grey.Lighten1)
                        .Background(backgroundColor)
                        .PaddingVertical(5)
                        .PaddingHorizontal(10)
                        .AlignCenter()
                        .AlignMiddle();
                }

                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                });

                table.Header(header =>
                {
                    header.Cell().Element(HeaderCellStyle).Text("商品名称");
                    header.Cell().Element(HeaderCellStyle).Text("规格");
                    header.Cell().Element(HeaderCellStyle).Text("单价");
                    header.Cell().Element(HeaderCellStyle).Text("数量");
                    header.Cell().Element(HeaderCellStyle).Text("小计");

                    IContainer HeaderCellStyle(IContainer container) => DefaultCellStyle(container, Colors.Grey.Lighten3);
                });

                foreach(var detail in order.Details)
                {
                    table.Cell().Element(CellStyle).Text(detail.ProductName);
                    table.Cell().Element(CellStyle).Text(detail.SkuSpecification);
                    table.Cell().Element(CellStyle).Text(detail.Price.ToString("C").Replace('¥', '￥'));
                    table.Cell().Element(CellStyle).Text(detail.Quantity.ToString());
                    table.Cell().Element(CellStyle).Text(detail.SubTotal.ToString("C").Replace('¥', '￥'));

                    IContainer CellStyle(IContainer container) => DefaultCellStyle(container, Colors.White);
                }

                table.Cell().ColumnSpan(5).Element(FootCellStyle).PaddingVertical(10).AlignCenter().Text($"共   {order.Details.Sum(m => m.Quantity)}   件，总计: {order.TotalAmount.ToString("C").Replace('¥', '￥')}").Bold();
                IContainer FootCellStyle(IContainer container) => DefaultCellStyle(container, Colors.White);

            });


        }
    }
}
