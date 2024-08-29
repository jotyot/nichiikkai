using Microsoft.EntityFrameworkCore;
using DictionaryAPI.Data;
using DictionaryAPI.Authorization;

var builder = WebApplication.CreateBuilder(args);

var DictionaryDbConnectionString = Environment.GetEnvironmentVariable("DICTIONARYDB_CONNECTION_STRING");

builder.Services.AddCors();
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
app.UseRouting();
app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true) // allow any origin
);

app.Run();
