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

    public async Task<List<WordDataDTO>> GetWords(List<string> levels, string jlptOrder = "descending", string orderBy = "alphabetical")
    {
        var words = _context.Words
            .Select(w => new WordDataDTO
            {
                WordPair = w.WordPair,
                JLPTLevel = w.JLPTLevel,
                FrequencyRank = w.FrequencyRank
            })
            .Where(w => levels.Contains(w.JLPTLevel));

        IOrderedQueryable<WordDataDTO> orderedWords;

        if (jlptOrder == "ascending")
        {
            orderedWords = words.OrderBy(w => w.JLPTLevel);
        }
        else
        {
            orderedWords = words.OrderByDescending(w => w.JLPTLevel);
        }

        if (orderBy == "alphabetical")
        {
            words = orderedWords.ThenBy(w => w.WordPair.Word);
        }
        else if (orderBy == "frequency")
        {
            words = orderedWords.ThenBy(w => w.FrequencyRank);
        }

        var result = await words.ToListAsync();

        return result;
    }
}