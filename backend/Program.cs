using Microsoft.EntityFrameworkCore;
using NIKAPI.Data;
using DotNetEnv;

Env.Load();

var UserDbConnectionString = Env.GetString("USERDB_CONNECTION_STRING");
var WordDbConnectionString = Env.GetString("WORDDB_CONNECTION_STRING");

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<NIKDbContext>(
    options => options.UseSqlServer(UserDbConnectionString)
);
builder.Services.AddDbContext<DictionaryDbContext>(
    options => options.UseSqlServer(WordDbConnectionString)
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
builder.Services.AddScoped<DictionaryService>();
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

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dictionaryService = services.GetRequiredService<DictionaryService>();
    var wordMigration = new WordMigration(dictionaryService);
    await wordMigration.MigrateWords();
}

app.Run();
