using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using DictionaryAPI.Data;

Env.Load();

var DictionaryDbConnectionString = Env.GetString("DICTIONARYDB_CONNECTION_STRING");

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DictionaryContext>(
    options => options.UseSqlServer(DictionaryDbConnectionString)
);
builder.Services.AddScoped<DictionaryService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.Run();
