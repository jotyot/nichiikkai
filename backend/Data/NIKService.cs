using Microsoft.EntityFrameworkCore;

namespace NIKAPI.Data;

public class NIKService
{
    private readonly NIKDbContext _context;
    private readonly IReviewIntervals _reviewIntervals;

    public NIKService(NIKDbContext context, IReviewIntervals reviewIntervals)
    {
        _context = context;
        _reviewIntervals = reviewIntervals;
    }


    private async Task<NIKUser> getUser(string userName)
    {
        var user = await _context.nik_users
            .FirstOrDefaultAsync(u => u.UserName == userName);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        return user;
    }

    private async Task<UserWord> getUserWord(string userName, string word, string reading)
    {
        var user = await getUser(userName);

        var userWord = await _context.user_words
            .FirstOrDefaultAsync(uw => uw.UserId == user.Id && uw.Word == word && uw.Reading == reading);

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

    public async Task<ICollection<UserWord>> GetUserWords(string userName)
    {
        var user = await getUser(userName);

        var userWords = await _context.user_words
            .Where(uw => uw.UserId == user.Id)
            .ToListAsync();

        return userWords;
    }

    public async Task<UserWord> GetUserWord(string userName, string word, string reading)
    {
        var userWord = await getUserWord(userName, word, reading);

        return userWord;
    }

    public async Task AddUserWord(string userName, string word, string reading)
    {
        var user = await getUser(userName);

        try
        {
            await getUserWord(userName, word, reading);
            throw new Exception("Word already exists");
        }
        catch (Exception) { }

        var userWord = new UserWord
        {
            UserId = user.Id,
            Word = word,
            Reading = reading,
        };

        _context.user_words.Add(userWord);

        await _context.SaveChangesAsync();
    }

    public async Task UpdateUserSynonyms(string userName, string word, string reading, List<string> userSynonyms)
    {
        var userWord = await getUserWord(userName, word, reading);

        userWord.UserSynonyms = userSynonyms;

        await _context.SaveChangesAsync();
    }

    private async Task updateUserWordLevel(UserWord userWord, int level)
    {
        level = _reviewIntervals.BindLevel(level);

        userWord.Level = level;
        userWord.NextReviewDay = _reviewIntervals.GetNextReviewDay(level);

        await _context.SaveChangesAsync();
    }

    public async Task IncrementUserWordLevel(string userName, string word, string reading)
    {
        var userWord = await getUserWord(userName, word, reading);
        await updateUserWordLevel(userWord, userWord.Level + 1);
    }

    public async Task DecrementUserWordLevel(string userName, string word, string reading)
    {
        var userWord = await getUserWord(userName, word, reading);
        await updateUserWordLevel(userWord, userWord.Level - 1);
    }

    public async Task SkipUserWord(string userName, string word, string reading)
    {
        var userWord = await getUserWord(userName, word, reading);
        userWord.Skipped = true;
        userWord.NextReviewDay = _reviewIntervals.GetNextReviewDay(9999);

        await _context.SaveChangesAsync();
    }

    public async Task UnskipUserWord(string userName, string word, string reading)
    {
        var userWord = await getUserWord(userName, word, reading);
        userWord.Skipped = false;
        userWord.NextReviewDay = _reviewIntervals.GetNextReviewDay(userWord.Level);

        await _context.SaveChangesAsync();
    }
}

public class WordPair
{
    public required string word { get; set; }
    public required string reading { get; set; }
}