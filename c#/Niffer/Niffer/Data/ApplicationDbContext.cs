using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Niffer.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext(options)
    {
        public DbSet<UserSubscription> UserSubscriptions => Set<UserSubscription>();
        public DbSet<Subscription> Subscriptions => Set<Subscription>();
    }

}
