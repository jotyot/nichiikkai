using Microsoft.EntityFrameworkCore;
namespace DictionaryAPI.Data;

public class DictionaryService
{
    private readonly DictionaryContext _context;
    public DictionaryService(DictionaryContext context)
    {
        _context = context;
    }

    private async Task<WordData?> getWordBase(WordBase wordBase)
    {
        var word = await _context.words
            .Include(w => w.WordBase)
            .Where(w => w.WordBase.Word == wordBase.Word && w.WordBase.Reading == wordBase.Reading)
            .FirstOrDefaultAsync();

        return word;
    }


    public async Task<WordData> GetWordData(WordBase wordBase)
    {
        var wordData = await getWordBase(wordBase);

        if (wordData == null)
        {
            throw new Exception("Word not found");
        }

        // im guessing the sentences are being loaded because of this
        await _context.sentences
            .Where(s => s.WordDataid == wordData.Id)
            .ToListAsync();

        return wordData;
    }

    public async Task<List<WordBase>> GetWords(List<string> levels, string jlptOrder = "ascending", string orderBy = "alphabetical", int page = 1)
    {
        const int pageSize = 500;

        var words = _context.word_bases
            .Where(w => levels.Contains(w.JlptLevel));

        IOrderedQueryable<WordBase> orderedWords;

        switch (jlptOrder)
        {
            case "descending":
                orderedWords = words.OrderByDescending(w => w.JlptLevel);
                break;
            default:
                orderedWords = words.OrderBy(w => w.JlptLevel);
                break;
        }

        switch (orderBy)
        {
            case "frequency":
                words = orderedWords.ThenBy(w => w.FrequencyRank > 0 ? 0 : 1).ThenBy(w => w.FrequencyRank);
                break;
            default:
                words = orderedWords.ThenBy(w => w.Reading);
                break;
        }


        var result = await words.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return result;
    }

    public async Task AddWordData(WordData wordData)
    {
        _context.words.Add(wordData);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteWord(WordBase wordBase)
    {
        var wordData = await getWordBase(wordBase);

        if (wordData == null)
        {
            throw new Exception("Word not found");
        }

        var relatedWordBase = await _context.word_bases
            .Where(wp => wp.Id == wordData.WordBase.Id)
            .ToListAsync();
        _context.word_bases.RemoveRange(relatedWordBase);

        var relatedSentences = await _context.sentences
            .Where(s => s.WordDataid == wordData.Id)
            .ToListAsync();
        _context.sentences.RemoveRange(relatedSentences);

        _context.words.Remove(wordData);
        await _context.SaveChangesAsync();
    }

    public async Task<WordBase> GenerateWord(List<string> levels, List<WordPair> wordPairs)
    {
        var word = await _context.word_bases
            .Where(w =>
                levels.Contains(w.JlptLevel) &&
                !wordPairs.Select(wp => wp.word + wp.reading).Contains(w.Word + w.Reading)
            )
            .OrderBy(w => w.FrequencyRank > 0 ? 0 : 1)
            .ThenBy(w => w.FrequencyRank)
            .FirstOrDefaultAsync();

        if (word == null)
        {
            throw new Exception("No word found");
        }

        return word;
    }
}

public class WordPair
{
    public required string word { get; set; }
    public required string reading { get; set; }
}