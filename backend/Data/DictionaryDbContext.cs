using Microsoft.EntityFrameworkCore;

namespace NIKAPI.Data;

public class DictionaryDbContext : DbContext
{
    public DictionaryDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<DictionaryWord> DictionaryWords { get; set; } = null!;
}

public class DictionaryWord
{
    public int Id { get; set; }
    public required string Word { get; set; }
    public required string JLPTLevel { get; set; }
    public int FrequencyRank { get; set; } = 99999;
    public string? Meaning { get; set; }
    public string? Reading { get; set; }
    public List<string> PartsOfSpeech { get; set; } = new List<string>();
    public List<string> Sentences { get; set; } = new List<string>();
    public List<string> Synonyms { get; set; } = new List<string>();
}

public class WordMigration
{
    private readonly LocalWordList localWordList = new LocalWordList();
    private readonly DictionaryService _service;
    public WordMigration(DictionaryService service)
    {
        _service = service;
    }

    public async Task MigrateWords()
    {
        var frequencyList = localWordList.GetWordFrequencyList();
        for (int i = 1; i <= 5; i++)
        {
            var words = localWordList.GetWordsByLevel($"N{i}");
            foreach (var word in words)
            {
                var frequencyRank = frequencyList.IndexOf(word);
                var dictionaryWord = new DictionaryWord
                {
                    Word = word,
                    JLPTLevel = $"N{i}",
                    FrequencyRank = frequencyRank == -1 ? 99999 : frequencyRank
                };
                await _service.AddWord(dictionaryWord);
            }
        }
    }


}