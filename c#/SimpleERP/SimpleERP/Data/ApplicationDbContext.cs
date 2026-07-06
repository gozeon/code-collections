using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace SimpleERP.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext(options)
    {
        public DbSet<IdSequence> IdSequences => Set<IdSequence>();
        public DbSet<DeliveryOrder> DeliveryOrders => Set<DeliveryOrder>();
        public DbSet<DeliveryOrderDetail> DeliveryOrderDetails => Set<DeliveryOrderDetail>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<DeliveryOrder>().HasIndex(o => o.YearMonth);

            builder.Entity<DeliveryOrderDetail>().HasOne(d => d.Order).WithMany(o => o.Details).HasForeignKey(d => d.OrderId).OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(builder);

        }
    }
}
