using Microsoft.EntityFrameworkCore;

namespace NIKAPI.Data;

public class NIKService
{
    private readonly NIKDbContext _context;

    public NIKService(NIKDbContext context)
    {
        _context = context;
    }

    private async Task<NIKUser> getUser(string userName)
    {
        var user = await _context.NIKUsers
            .FirstOrDefaultAsync(u => u.UserName == userName);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        return user;
    }

    private async Task<UserWord> getUserWord(string userName, string word)
    {
        var user = await _context.NIKUsers
            .Include(u => u.UserWords)
            .FirstOrDefaultAsync(u => u.UserName == userName);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        var userWord = user.UserWords.FirstOrDefault(uw => uw.Word == word);

        if (userWord == null)
        {
            throw new Exception("Word not found");
        }

        return userWord;
    }

    public async Task<List<string>> GetSelectedLevels(string userName)
    {
        var user = await getUser(userName);

        return user.SelectedLevels;
    }

    public async Task UpdateSelectedLevels(string userName, List<string> selectedLevels)
    {
        if (selectedLevels.Count == 0)
        {
            throw new Exception("Selected levels cannot be empty");
        }

        var validLevels = new List<string> { "N5", "N4", "N3", "N2", "N1" };
        foreach (var level in selectedLevels)
        {
            if (!validLevels.Contains(level))
            {
                throw new Exception("Invalid level");
            }
        }

        var user = await getUser(userName);
        user.SelectedLevels = selectedLevels;
        await _context.SaveChangesAsync();
    }

    public async Task<ICollection<UserWordDTO>> GetUserWords(string userName)
    {
        var user = await _context.NIKUsers
            .Include(u => u.UserWords) // Eager loading
            .FirstOrDefaultAsync(u => u.UserName == userName);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        // Avoid circular reference with userId
        var userWords = user.UserWords.Select(uw => new UserWordDTO
        {
            Word = uw.Word,
            Level = uw.Level,
            NextReviewDay = uw.NextReviewDay,
            UserSynonyms = uw.UserSynonyms,
        }).ToList();

        return userWords;
    }

    public async Task<UserWordDTO> GetUserWord(string userName, string word)
    {
        var userWord = await getUserWord(userName, word);

        return new UserWordDTO
        {
            Word = userWord.Word,
            Level = userWord.Level,
            NextReviewDay = userWord.NextReviewDay,
            UserSynonyms = userWord.UserSynonyms,
        };
    }

    public async Task AddUserWord(string userName, string word)
    {
        var user = await _context.NIKUsers
            .FirstOrDefaultAsync(u => u.UserName == userName);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        if (user.UserWords.FirstOrDefault(uw => uw.Word == word) != null)
        {
            throw new Exception("Word already exists");
        }

        var userWord = new UserWord
        {
            UserId = user.Id,
            User = user,
            Word = word,
        };

        user.UserWords.Add(userWord);

        await _context.SaveChangesAsync();
    }

    public async Task UpdateUserSynonyms(string userName, string word, List<string> userSynonyms)
    {
        var userWord = await getUserWord(userName, word);

        userWord.UserSynonyms = userSynonyms;

        await _context.SaveChangesAsync();
    }

    private async Task updateUserWordLevel(UserWord userWord, int level)
    {
        IReviewIntervals ReviewIntervals = new DefaultReviewIntervals();

        level = ReviewIntervals.BindLevel(level);

        userWord.Level = level;
        userWord.NextReviewDay = ReviewIntervals.GetNextReviewDay(level);

        await _context.SaveChangesAsync();
    }

    public async Task IncrementUserWordLevel(string userName, string word)
    {
        var userWord = await getUserWord(userName, word);
        await updateUserWordLevel(userWord, userWord.Level + 1);
    }

    public async Task DecrementUserWordLevel(string userName, string word)
    {
        var userWord = await getUserWord(userName, word);
        await updateUserWordLevel(userWord, userWord.Level - 1);
    }

    public async Task SkipUserWord(string userName, string word)
    {
        var userWord = await getUserWord(userName, word);
        await updateUserWordLevel(userWord, 999);
    }

    public async Task<string> GenerateWord(string userName)
    {
        var WordGenerator = new WordGenerator(this);
        return await WordGenerator.GenerateWord(userName);
    }
}

public class UserWordDTO
{
    public required string Word { get; set; }
    public int Level { get; set; }
    public DateOnly NextReviewDay { get; set; }
    public List<string> UserSynonyms { get; set; } = new List<string>();
}