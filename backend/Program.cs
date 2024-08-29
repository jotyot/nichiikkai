using Microsoft.EntityFrameworkCore;
using NIKAPI.Data;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.Google;

Env.Load();

var UserDbConnectionString = Env.GetString("USERDB_CONNECTION_STRING");

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();

builder.Services.AddDbContext<NIKDbContext>(
    options => options.UseNpgsql(UserDbConnectionString)
);

builder.Services.AddSingleton<IReviewIntervals, DefaultReviewIntervals>();
builder.Services.AddScoped<NIKService>();
builder.Services.AddHttpContextAccessor();

builder.Services.AddAuthentication();
// builder.Services.AddAuthentication(
// options =>
// {
//     options.DefaultAuthenticateScheme = GoogleDefaults.AuthenticationScheme;
//     options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
// }
// )
// .AddGoogle(options =>
//     {
//         options.ClientId = Env.GetString("GOOGLE_CLIENT_ID");
//         options.ClientSecret = Env.GetString("GOOGLE_CLIENT_SECRET");
//     });

builder.Services.AddIdentityApiEndpoints<NIKUser>()
    .AddEntityFrameworkStores<NIKDbContext>();

builder.Services.AddControllers();
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true) // allow any origin
);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
// app.MapDefaultControllerRoute();

app.MapGroup("identity").MapIdentityApi<NIKUser>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Run();
