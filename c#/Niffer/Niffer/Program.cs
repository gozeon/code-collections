using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Niffer.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddRazorPages();
builder.Services.AddHttpClient();
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.MapControllers();

using(var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        await Niffer.Data.SeedData.InitializeAsync(services);
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
