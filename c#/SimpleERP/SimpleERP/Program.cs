using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using SimpleERP.Data;
using SimpleERP.Services;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

var supportedCultures = new[]
{
    new CultureInfo("zh-CN")
};
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    options.DefaultRequestCulture = new RequestCulture("zh-CN");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;

    // 可选：不允许从 Cookie、浏览器语言覆盖
    options.RequestCultureProviders.Clear();
});

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddRazorPages();

builder.Services.AddControllers();

builder.Services.AddScoped<IIdGeneratorService, IdGeneratorService>();
builder.Services.AddScoped<IDeliveryOrderPdfService, DeliveryOrderPdfService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Error");
}

app.UseRouting();

app.UseAuthorization();
app.UseRequestLocalization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        await SimpleERP.Data.SeedData.InitializeAsync(services);
    }
    catch (Exception ex)
    {
        Console.WriteLine("初始化数据失败", ex);
        throw;
    }
}

app.Use((context, next) =>
{
    if (context.Request.Path.Value != null && context.Request.Path.Value.Equals("/Identity/Account/Register", StringComparison.OrdinalIgnoreCase))
    {
        context.Response.StatusCode = 404;
        return Task.CompletedTask;
    }
    return next();
});
app.Run();
