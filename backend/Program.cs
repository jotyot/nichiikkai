using Microsoft.EntityFrameworkCore;
using NIKAPI.Data;
using NIKAPI.Authorization;
using DotNetEnv;

Env.Load();

var UserDbConnectionString = Env.GetString("USERDB_CONNECTION_STRING");

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<NIKDbContext>(
    options => options.UseNpgsql(UserDbConnectionString)
);
builder.Services.AddIdentityApiEndpoints<NIKUser>().AddEntityFrameworkStores<NIKDbContext>();
builder.Services.AddSingleton<SameUserAuthorizationFilter>();
builder.Services.AddScoped<NIKService>();
builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGroup("/identity").MapIdentityApi<NIKUser>();

app.Run();
