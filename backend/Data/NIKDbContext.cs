using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace NIKAPI.Data;

public class NIKDbContext : IdentityDbContext
{
    public NIKDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<NIKUser> NIKUsers { get; set; } = null!;
}