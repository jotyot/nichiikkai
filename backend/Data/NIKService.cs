using Microsoft.EntityFrameworkCore;

namespace NIKAPI.Data;

public class NIKService
{
    private readonly NIKDbContext _context;

    public NIKService(NIKDbContext context)
    {
        _context = context;
    }

    public async Task<List<string>> GetSelectedLevels(string userName)
    {
        var user = await _context.NIKUsers
            .FirstOrDefaultAsync(u => u.UserName == userName);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        return user.SelectedLevels;
    }

    public async Task UpdateSelectedLevels(string userName, List<string> selectedLevels)
    {
        var user = await _context.NIKUsers
            .FirstOrDefaultAsync(u => u.UserName == userName);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        user.SelectedLevels = selectedLevels;
        await _context.SaveChangesAsync();
    }

    public async Task<ICollection<UserWord>> GetUserWords(string userName)
    {
        var user = await _context.NIKUsers
            .FirstOrDefaultAsync(u => u.UserName == userName);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        return user.UserWords;
    }

    public async Task AddUserWord(string userName, string word)
    {
        var user = await _context.NIKUsers
            .FirstOrDefaultAsync(u => u.UserName == userName);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        var userWord = new UserWord
        {
            UserId = user.Id,
            User = user,
            Word = word,
            Level = 1
        };

        user.UserWords.Add(userWord);
        await _context.SaveChangesAsync();
    }
}