using Microsoft.EntityFrameworkCore;
namespace DictionaryAPI.Data;

/*
    I'm pretty sure everything has to be lowercase for postgres
*/
public class DictionaryContext : DbContext
{
    public DictionaryContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<WordData> words { get; set; } = null!;
    public DbSet<WordBase> word_bases { get; set; } = null!;
    public DbSet<SentenceData> sentences { get; set; } = null!;
}

public class WordData
{
    public int id { get; set; }
    public required WordBase word_base { get; set; }
    public List<string> readings { get; set; } = new List<string>();
    public List<string> meanings { get; set; } = new List<string>();
    public List<string> parts_of_speech { get; set; } = new List<string>();
    public List<SentenceData> sentences { get; set; } = new List<SentenceData>();

}

public class WordBase : IEquatable<WordBase>
{
    public int id { get; set; }
    public required string word { get; set; }
    public required string reading { get; set; }
    public required string meaning { get; set; }
    public int frequency_rank { get; set; } // 0 means not in the top 20,000
    public required string jlpt_level { get; set; }

    public override bool Equals(object? obj) => Equals(obj as WordBase);
    public bool Equals(WordBase? other)
    {
        if (other == null)
        {
            return false;
        }

        return word == other.word && reading == other.reading;
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(word, reading);
    }
}

public class SentenceData
{
    public int id { get; set; }
    // i know the naming isn't consistent but i'm just trying to get this to work with the established database
    public int WordDataid { get; set; }
    public required string japanese { get; set; }
    public required string english { get; set; }
}