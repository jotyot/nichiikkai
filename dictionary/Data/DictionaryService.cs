using Microsoft.EntityFrameworkCore;
namespace DictionaryAPI.Data;

public class DictionaryService
{
    private readonly DictionaryContext _context;
    public DictionaryService(DictionaryContext context)
    {
        _context = context;
    }

    public async Task<WordData> GetWordData(WordPair wordPair)
    {
        var wordData = await _context.Words
            .FirstOrDefaultAsync(w => w.WordPair.Equals(wordPair));

        if (wordData == null)
        {
            throw new Exception("Word not found");
        }

        return wordData;
    }

    public async Task<List<WordDataLimited>> GetWords(List<string> levels, string jlptOrder = "ascending", string orderBy = "alphabetical")
    {
        var words = _context.Words
            .Select(w => new WordDataLimited
            {
                WordPair = w.WordPair,
                JLPTLevel = w.JLPTLevel,
                FrequencyRank = w.FrequencyRank
            })
            .Where(w => levels.Contains(w.JLPTLevel));

        IOrderedQueryable<WordDataLimited> orderedWords;

        if (jlptOrder == "descending")
        {
            orderedWords = words.OrderByDescending(w => w.JLPTLevel);
        }
        else
        {
            orderedWords = words.OrderBy(w => w.JLPTLevel);
        }

        switch (orderBy)
        {
            case "alphabetical":
                words = orderedWords.ThenBy(w => w.WordPair.Reading);
                break;
            case "frequency":
                words = orderedWords.ThenBy(w => w.FrequencyRank);
                break;
        }

        var result = await words.ToListAsync();

        return result;
    }

    public async Task AddWordData(WordData wordData)
    {
        _context.Words.Add(wordData);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateWord(WordPair wordPair, WordData wordData)
    {
        var existingWordData = await _context.Words
            .FirstOrDefaultAsync(w => w.WordPair.Equals(wordPair));

        if (existingWordData == null)
        {
            throw new Exception("Word not found");
        }

        existingWordData = wordData;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteWord(WordPair wordPair)
    {
        var wordData = await _context.Words
            .FirstOrDefaultAsync(w => w.WordPair.Equals(wordPair));

        if (wordData == null)
        {
            throw new Exception("Word not found");
        }

        _context.Words.Remove(wordData);
        await _context.SaveChangesAsync();
    }
}