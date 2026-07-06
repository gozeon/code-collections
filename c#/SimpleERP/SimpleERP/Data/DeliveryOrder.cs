using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleERP.Data
{
    public class DeliveryOrder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)] // 禁用自增，使用自己生成的id
        public string Id { get; set; } = string.Empty;

        [Required]
        [StringLength(6)]
        public string YearMonth { get; set; } = string.Empty;

        public DateTime CreateTime { get; set; } = DateTime.Now;
        public DateTime? DeliveryTime { get; set; } // 发货时间
        public string? Remark { get; set; } // 备注

        public string Consignee { get; set; } = string.Empty; // 收货人
        public string Address { get; set; } = string.Empty;   // 收货地址

        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalAmount { get; set; } // 订单总金额


        public List<DeliveryOrderDetail> Details { get; set; } = new();
    }
}
