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
        var words = await _context.words
            .Include(w => w.word_base)
            .ToListAsync();

        // .FirstOrDefaultAsync(w => w.WordPair.Equals(wordPair)) doesn't work for some reason 
        // I'm guessing the Equals doesn't work when the WordPair is a navigation property
        return words.Find(w => w.word_base.Equals(wordBase));
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
            .Where(s => s.WordDataid == wordData.id)
            .ToListAsync();

        return wordData;
    }

    public async Task<List<WordBase>> GetWords(List<string> levels, string jlptOrder = "ascending", string orderBy = "alphabetical", int page = 1)
    {
        const int pageSize = 500;

        var words = _context.word_bases
            .Where(w => levels.Contains(w.jlpt_level));

        switch (jlptOrder)
        {
            case "ascending":
                words = words.OrderBy(w => w.jlpt_level);
                words = secondOrdering(orderBy, words);
                break;
            case "descending":
                words = words.OrderByDescending(w => w.jlpt_level);
                words = secondOrdering(orderBy, words);
                break;
            default:
                switch (orderBy)
                {
                    case "alphabetical":
                        words = words.OrderBy(w => w.reading);
                        break;
                    case "frequency":
                        words = words.OrderBy(w => w.frequency_rank > 0 ? 0 : 1).ThenBy(w => w.frequency_rank);
                        break;
                }
                break;
        }


        var result = await words.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return result;

        // this works but i hate how it looks
        static IQueryable<WordBase> secondOrdering(string orderBy, IQueryable<WordBase> words)
        {
            switch (orderBy)
            {
                case "alphabetical":
                    words = ((IOrderedQueryable<WordBase>)words).ThenBy(w => w.reading);
                    break;
                case "frequency":
                    words = ((IOrderedQueryable<WordBase>)words).ThenBy(w => w.frequency_rank > 0 ? 0 : 1).ThenBy(w => w.frequency_rank);
                    break;
            }

            return words;
        }
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
            .Where(wp => wp.id == wordData.word_base.id)
            .ToListAsync();
        _context.word_bases.RemoveRange(relatedWordBase);

        var relatedSentences = await _context.sentences
            .Where(s => s.WordDataid == wordData.id)
            .ToListAsync();
        _context.sentences.RemoveRange(relatedSentences);

        _context.words.Remove(wordData);
        await _context.SaveChangesAsync();
    }
}