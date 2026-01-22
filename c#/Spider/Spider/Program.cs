using Spider;
using Serilog;
using Spider.Workers;
using Spider.Queue;
using Spider.Utils;
using Spider.Interfaces;
using Spider.Services;

// exe 运行目录
var baseDir = AppContext.BaseDirectory;
Environment.SetEnvironmentVariable("BASE_DIR", baseDir);

var builder = Host.CreateApplicationBuilder(args);

// 初始化serilog
builder.Services.AddSerilog((services, loggerConfiguration) =>
{
	loggerConfiguration.ReadFrom.Configuration(builder.Configuration).ReadFrom.Services(services);
});


builder.Services.Configure<SnapshotOptions>(builder.Configuration.GetSection("Snapshot"));

builder.Services.AddSingleton<SnapshotService>();
// 去重器
builder.Services.AddSingleton<UrlDeduplicator>();
// 任务
builder.Services.AddSingleton<CrawlTaskQueue>();
// 注入网站匹配器
builder.Services.AddSingleton<IPageHandler, BingSearchHandler>();
builder.Services.AddSingleton<IPageHandler, DefaultHandler>();
builder.Services.AddSingleton<PageHandlerFactory>();

builder.Services.AddHostedService<PlaywrightWorker>();
//builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
