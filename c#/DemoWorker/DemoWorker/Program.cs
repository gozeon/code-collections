using DemoWorker;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.Configure<TaskOptions>(
    builder.Configuration.GetSection("TaskOptions"));

builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
