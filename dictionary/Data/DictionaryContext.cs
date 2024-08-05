using Microsoft.EntityFrameworkCore;
namespace DictionaryAPI.Data;
public class DictionaryContext : DbContext
{
    public DictionaryContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<WordData> Words { get; set; } = null!;
}

public class WordData
{
    public int Id { get; set; }
    public required WordPair WordPair { get; set; }
    public required string JLPTLevel { get; set; }
    public List<string> Readings { get; set; } = new List<string>();
    public List<string> Meanings { get; set; } = new List<string>();
    public List<string> PartsOfSpeech { get; set; } = new List<string>();
    public List<SentenceData> Sentences { get; set; } = new List<SentenceData>();
    public int FrequencyRank { get; set; } // 0 means not in the top 20,000
}

public class WordPair : IEquatable<WordPair>
{
    public int Id { get; set; }
    public required string Word { get; set; }
    public required string Reading { get; set; }

    public override bool Equals(object? obj) => Equals(obj as WordPair);

    public bool Equals(WordPair? other)
    {
        if (other == null)
        {
            return false;
        }

        return Word == other.Word && Reading == other.Reading;
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(Word, Reading);
    }
}

public class SentenceData
{
    public int Id { get; set; }
    public required string Japanese { get; set; }
    public required string English { get; set; }
}

public class WordDataDTO
{
    public required WordPair WordPair { get; set; }
    public required string JLPTLevel { get; set; }
    public int FrequencyRank { get; set; }
}