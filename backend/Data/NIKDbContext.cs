using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace NIKAPI.Data;

public class NIKDbContext : IdentityDbContext
{
    public NIKDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<NIKUser> NIKUsers { get; set; } = null!;
}

public class NIKUser : IdentityUser
{
    public List<string> SelectedLevels { get; set; } = new List<string>(["N3"]);

    public ICollection<UserWord> UserWords { get; set; } = new List<UserWord>();
}

public class UserWord
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public required NIKUser User { get; set; }
    public required WordPair WordPair { get; set; }
    public int Level { get; set; } = 1;
    public DateOnly NextReviewDay { get; set; } = DateOnly.FromDateTime(DateTime.Now.AddDays(1));
    public List<string> UserSynonyms { get; set; } = new List<string>();
}

public class UserWordDTO
{
    public required WordPair WordPair { get; set; }
    public int Level { get; set; }
    public DateOnly NextReviewDay { get; set; }
    public List<string> UserSynonyms { get; set; } = new List<string>();
}

public class WordPair : IEquatable<WordPair>
{
    public required string Word { get; set; }
    public required string Reading { get; set; }

    public override bool Equals(object? obj) => Equals(obj as WordPair);
    public bool Equals(WordPair? other)
    {
        if (other is null)
        {
            return false;
        }

        return Word == other.Word && Reading == other.Reading;
    }

    public override int GetHashCode() => (Word, Reading).GetHashCode();
}

