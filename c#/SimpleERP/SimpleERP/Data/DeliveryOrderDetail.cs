using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleERP.Data
{
    public class DeliveryOrderDetail
    {
        public int Id { get; set; }

        [Required]
        public string OrderId { get; set; } = string.Empty; // 外键，关联主表 Id

        [Required]
        public string ProductName { get; set; } = string.Empty; // 商品名称

        public string SkuSpecification { get; set; } = string.Empty; // 规格（例如：红色, XL码）

        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; } // 单价

        public int Quantity { get; set; } // 数量

        [NotMapped] // 不映射到数据库，仅用于业务计算
        public decimal SubTotal => Price * Quantity; // 小计金额


        public DeliveryOrder? Order { get; set; }
    }
}
