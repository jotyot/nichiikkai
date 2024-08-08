using Microsoft.EntityFrameworkCore;
namespace DictionaryAPI.Data;

public class DictionaryService
{
    private readonly DictionaryContext _context;
    public DictionaryService(DictionaryContext context)
    {
        _context = context;
    }

    private async Task<WordData?> getWordData(WordBase wordBase)
    {
        var words = await _context.Words
            .Include(w => w.WordBase)
            .Include(w => w.Sentences)
            .ToListAsync();

        // .FirstOrDefaultAsync(w => w.WordPair.Equals(wordPair)) doesn't work for some reason 
        // I'm guessing the Equals doesn't work when the WordPair is a navigation property
        return words.Find(w => w.WordBase.Equals(wordBase));
    }


    public async Task<WordData> GetWordData(WordBase wordBase)
    {
        var wordData = await getWordData(wordBase);

        if (wordData == null)
        {
            throw new Exception("Word not found");
        }

        return wordData;
    }

    public async Task<List<WordBase>> GetWords(List<string> levels, string jlptOrder = "ascending", string orderBy = "alphabetical", int page = 1)
    {
        const int pageSize = 100;

        var words = _context.WordBases
            .Where(w => levels.Contains(w.JLPTLevel));

        IOrderedQueryable<WordBase> orderedWords;

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
                words = orderedWords.ThenBy(w => w.Reading);
                break;
            case "frequency":
                words = orderedWords.ThenBy(w => w.FrequencyRank > 0 ? 0 : 1).ThenByDescending(w => w.FrequencyRank);
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

    public async Task DeleteWord(WordBase wordBase)
    {
        var wordData = await getWordData(wordBase);

        if (wordData == null)
        {
            throw new Exception("Word not found");
        }

        var relatedWordBase = await _context.WordBases
            .Where(wp => wp.Id == wordData.WordBase.Id)
            .ToListAsync();
        _context.WordBases.RemoveRange(relatedWordBase);

        var relatedSentences = await _context.Sentences
            .Where(s => wordData.Sentences.Select(ws => ws.Id).Contains(s.Id))
            .ToListAsync();
        _context.Sentences.RemoveRange(relatedSentences);

        _context.Words.Remove(wordData);
        await _context.SaveChangesAsync();
    }
}