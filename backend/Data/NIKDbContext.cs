using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace NIKAPI.Data;

public class NIKDbContext : IdentityDbContext
{
    public NIKDbContext(DbContextOptions options) : base(options)
    {
    }
    // i guess the tables have to be lowercase?? am i making something up
    public DbSet<NIKUser> nik_users { get; set; } = null!;
    public DbSet<UserWord> user_words { get; set; } = null!;
}

public class NIKUser : IdentityUser
{
    public List<string> SelectedLevels { get; set; } = new List<string>(["N3"]);
}

public class UserWord
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public required string Word { get; set; }
    public required string Reading { get; set; }
    public int Level { get; set; } = 1;
    public DateOnly NextReviewDay { get; set; } = DateOnly.FromDateTime(DateTime.Now.AddDays(1));
    public List<string> UserSynonyms { get; set; } = new List<string>();
    public bool WordPairMatch(string word, string reading)
    {
        return Word == word && Reading == reading;
    }
}
