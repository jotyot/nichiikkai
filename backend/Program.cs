using Microsoft.EntityFrameworkCore;
using NIKAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<NIKDbContext>(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("UserDb"))
);
builder.Services.AddIdentityApiEndpoints<NIKUser>().AddEntityFrameworkStores<NIKDbContext>();
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("SameUser", policy =>
        policy.RequireAssertion(context =>
        {
            var userId = context.User.Identity?.Name;
            var routeUserId = new HttpContextAccessor().HttpContext?.Request.RouteValues["userName"]?.ToString();
            return userId == routeUserId;
        })
    );
});
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

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.RequireAuthorization()
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
