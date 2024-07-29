using Microsoft.EntityFrameworkCore;

namespace NIKAPI.Data;

public class DictionaryService
{
    private readonly DictionaryDbContext _context;

    public DictionaryService(DictionaryDbContext context)
    {
        _context = context;
    }

    public async Task<List<DictionaryWord>> GetWordsByLevel(string level)
    {
        return await _context.DictionaryWords
            .Where(w => w.JLPTLevel == level)
            .ToListAsync();
    }

    public async Task<DictionaryWord> GetWord(string word)
    {
        var entry = await _context.DictionaryWords
            .FirstOrDefaultAsync(w => w.Word == word);

        if (entry == null)
        {
            throw new Exception("Word not found");
        }

        return entry;
    }

    public async Task AddWord(DictionaryWord word)
    {
        if (await _context.DictionaryWords.AnyAsync(w => w.Word == word.Word))
        {
            throw new Exception("Word already exists");
        }

        _context.DictionaryWords.Add(word);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateWord(DictionaryWord word)
    {
        _context.DictionaryWords.Update(word);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteWord(string word)
    {
        var wordToDelete = await GetWord(word);
        _context.DictionaryWords.Remove(wordToDelete);
        await _context.SaveChangesAsync();
    }
}