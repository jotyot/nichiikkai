using Microsoft.EntityFrameworkCore;
namespace DictionaryAPI.Data;

public class DictionaryService
{
    private readonly DictionaryContext _context;
    public DictionaryService(DictionaryContext context)
    {
        _context = context;
    }

    private async Task<WordData?> getWordData(WordPair wordPair)
    {
        var words = await _context.Words
            .Include(w => w.WordPair)
            .Include(w => w.Sentences)
            .ToListAsync();

        // .FirstOrDefaultAsync(w => w.WordPair.Equals(wordPair)) doesn't work for some reason 
        // I'm guessing the Equals doesn't work when the WordPair is a navigation property
        return words.Find(w => w.WordPair.Equals(wordPair));
    }


    public async Task<WordData> GetWordData(WordPair wordPair)
    {
        var wordData = await getWordData(wordPair);

        if (wordData == null)
        {
            throw new Exception("Word not found");
        }

        return wordData;
    }

    public async Task<List<WordDataLimited>> GetWords(List<string> levels, string jlptOrder = "ascending", string orderBy = "alphabetical", int page = 1)
    {
        const int pageSize = 20;

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
                words = orderedWords.ThenBy(w => w.FrequencyRank > 0).ThenBy(w => w.FrequencyRank);
                break;
        }

        var result = await words.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return result;
    }

    public async Task AddWordData(WordData wordData)
    {
        _context.Words.Add(wordData);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteWord(WordPair wordPair)
    {
        var wordData = await getWordData(wordPair);

        if (wordData == null)
        {
            throw new Exception("Word not found");
        }

        var relatedWordPair = await _context.WordPairs
            .Where(wp => wp.Id == wordData.WordPair.Id)
            .ToListAsync();
        _context.WordPairs.RemoveRange(relatedWordPair);

        var relatedSentences = await _context.Sentences
            .Where(s => wordData.Sentences.Select(ws => ws.Id).Contains(s.Id))
            .ToListAsync();
        _context.Sentences.RemoveRange(relatedSentences);

        _context.Words.Remove(wordData);
        await _context.SaveChangesAsync();
    }
}