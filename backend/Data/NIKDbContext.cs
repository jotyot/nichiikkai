using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace NIKAPI.Data;

public class NIKDbContext : IdentityDbContext
{
    public NIKDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<NIKUser> nik_users { get; set; } = null!;
    public DbSet<UserWord> user_words { get; set; } = null!;
}

public class NIKUser : IdentityUser
{
    public List<string> selected_levels { get; set; } = new List<string>(["N3"]);
    public ICollection<UserWord> user_words { get; set; } = new List<UserWord>();
}

public class UserWord
{
    public int id { get; set; }
    public required string word { get; set; }
    public required string reading { get; set; }
    public int level { get; set; } = 1;
    public DateOnly next_review_day { get; set; } = DateOnly.FromDateTime(DateTime.Now.AddDays(1));
    public List<string> user_synonyms { get; set; } = new List<string>();
}