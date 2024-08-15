using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using DictionaryAPI.Data;
using DictionaryAPI.Authorization;

Env.Load();

var DictionaryDbConnectionString = Env.GetString("DICTIONARYDB_CONNECTION_STRING");

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DictionaryContext>(
    options => options.UseNpgsql(DictionaryDbConnectionString)
);
builder.Services.AddScoped<DictionaryService>();
builder.Services.AddSingleton<ApiKeyAuthorizationFilter>();
builder.Services.AddSingleton<IApiKeyValidator, ApiKeyValidator>();
builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.Run();
