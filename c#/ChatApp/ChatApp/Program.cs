using ChatApp.Components;
using ChatApp.Services;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.Extensions.AI;
using OpenAI;
using OpenAI.Chat;
using System.Buffers.Text;
using System.ClientModel;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorComponents().AddInteractiveServerComponents();

// You will need to set the endpoint and key to your own values
// You can do this using Visual Studio's "Manage User Secrets" UI, or on the command line:
//   cd this-project-directory
//   dotnet user-secrets set OpenAI:Key YOUR-API-KEY

var openAiClient = new ChatClient(
       model: builder.Configuration.GetSection("DeepSeek:Model").Value!,
       credential: new ApiKeyCredential(builder.Configuration.GetSection("DeepSeek:ApiKey").Value!),
       options: new OpenAIClientOptions
       {
           Endpoint = new Uri(builder.Configuration.GetSection("DeepSeek:BaseUrl").Value!)
       }
       );

#pragma warning disable OPENAI001 // GetResponsesClient() is experimental and subject to change or removal in future updates.
var chatClient = openAiClient.AsIChatClient();
#pragma warning restore OPENAI001


builder.Services.AddChatClient(chatClient).UseFunctionInvocation().UseLogging();

// function calling
builder.Services.AddScoped<CustomerServiceToolkit>();

// 话术
builder.Services.AddSingleton<IRuleService, LocalRuleService>();

// 获取不同的连接字符串
var userConnStr = builder.Configuration.GetConnectionString("UserDbConnection");
var mediaConnStr = builder.Configuration.GetConnectionString("MediaDbConnection");
var faqConnStr = builder.Configuration.GetConnectionString("FaqDbConnection");

// 分别注册为单例或瞬态服务
builder.Services.AddSingleton<IUserDbConnectionFactory>(new UserDbConnectionFactory(userConnStr!));
builder.Services.AddSingleton<IMediaDbConnectionFactory>(new MediaDbConnectionFactory(mediaConnStr!));
builder.Services.AddSingleton<IFaqDbConnectionFactory>(new FaqDbConnectionFactory(faqConnStr!));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseAntiforgery();

app.UseStaticFiles();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
