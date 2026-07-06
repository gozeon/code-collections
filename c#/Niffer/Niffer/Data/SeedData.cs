using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace SimpleERP.Data
{
    public class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            // 正常是导出sql，先执行sql，在启动程序
            // dotnet ef migrations script -o deploy.sql
            // 从服务提供者中动态捞出 ApplicationDbContext
            using var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            // 执行自动迁移，全自动建表（解决 no such table 报错）
            await context.Database.MigrateAsync();

            using var scope = serviceProvider.CreateScope();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();

            string adminRole = "Admin";
            if(!await roleManager.RoleExistsAsync(adminRole))
            {
                await roleManager.CreateAsync(new IdentityRole(adminRole));
            }

            // 没有用户就增加
            if (!userManager.Users.Any())
            {
                var adminUser = new IdentityUser
                {
                    // username和email必须一致
                    UserName = "admin@admin.com",
                    Email = "admin@admin.com",
                    EmailConfirmed = true,
                };

                string adminPassword = "AdminPassword123!";
                var createResult = await userManager.CreateAsync(adminUser, adminPassword);
                if(createResult.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, adminRole);
                }
            }
        }
    }
}
