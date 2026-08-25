using Microsoft.Extensions.AI;
using OpenAI;
using OpenAI.Chat;
using System.ClientModel;
using UserProfileApi.Interfaces;
using UserProfileApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// 获取不同的连接字符串
var userConnStr = builder.Configuration.GetConnectionString("UserDbConnection");
var mediaConnStr = builder.Configuration.GetConnectionString("MediaDbConnection");
var faqConnStr = builder.Configuration.GetConnectionString("FaqDbConnection");

// 分别注册为单例或瞬态服务
builder.Services.AddSingleton<IUserDbConnectionFactory>(new UserDbConnectionFactory(userConnStr!));
builder.Services.AddSingleton<IMediaDbConnectionFactory>(new MediaDbConnectionFactory(mediaConnStr!));
builder.Services.AddSingleton<IFaqDbConnectionFactory>(new FaqDbConnectionFactory(faqConnStr!));

//deepseek
builder.Services.AddChatClient(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var apiKey = config["DeepSeek:ApiKey"]!;
    var baseUrl = config["DeepSeek:BaseUrl"]!;
    var model = config["DeepSeek:Model"]!;

    var openAiClient = new ChatClient(
        model: model,
        credential: new ApiKeyCredential(apiKey),
        options: new OpenAIClientOptions
        {
            Endpoint = new Uri(baseUrl)
        }
        );

    return openAiClient.AsIChatClient();
});

// 话术
builder.Services.AddSingleton<IRuleService, LocalRuleService>();

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

app.Run();
