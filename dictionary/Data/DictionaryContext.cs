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
    public int Id { get; set; }
    public required WordBase WordBase { get; set; }
    public List<string> Readings { get; set; } = new List<string>();
    public List<string> Meanings { get; set; } = new List<string>();
    public List<string> PartsOfSpeech { get; set; } = new List<string>();
    public List<SentenceData> Sentences { get; set; } = new List<SentenceData>();
}

public class WordBase
{
    public int Id { get; set; }
    public required string Word { get; set; }
    public required string Reading { get; set; }
    public required string Meaning { get; set; }
    public int FrequencyRank { get; set; } // 0 means not in the top 20,000
    public required string JlptLevel { get; set; }
}

public class SentenceData
{
    public int Id { get; set; }
    // i know the naming isn't consistent but i'm just trying to get this to work with the established database
    public int WordDataid { get; set; }
    public required string Japanese { get; set; }
    public required string English { get; set; }
}