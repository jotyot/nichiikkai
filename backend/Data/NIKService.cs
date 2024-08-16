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
        var user = await _context.nik_users
            .Include(u => u.user_words) // Eager loading
            .FirstOrDefaultAsync(u => u.UserName == userName);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        return user;
    }

    private async Task<UserWord> getUserWord(string userName, string word, string reading)
    {
        var user = await _context.nik_users
            .Include(u => u.user_words)
            .FirstOrDefaultAsync(u => u.UserName == userName);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        var userWord = user.user_words.FirstOrDefault(uw => uw.word == word && uw.reading == reading);

        if (userWord == null)
        {
            throw new Exception("Word not found");
        }

        return userWord;
    }

    public async Task<List<string>> GetSelectedLevels(string userName)
    {
        var user = await getUser(userName);

        return user.selected_levels;
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
        user.selected_levels = selectedLevels;
        await _context.SaveChangesAsync();
    }

    public async Task<ICollection<UserWord>> GetUserWords(string userName)
    {
        var user = await getUser(userName);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        var userWords = user.user_words.ToList();

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

        if (user == null)
        {
            throw new Exception("User not found");
        }

        if (user.user_words.FirstOrDefault(uw => uw.word == word && uw.reading == reading) != null)
        {
            throw new Exception("Word already exists");
        }

        var userWord = new UserWord
        {
            word = word,
            reading = reading
        };

        user.user_words.Add(userWord);

        await _context.SaveChangesAsync();
    }

    public async Task UpdateUserSynonyms(string userName, string word, string reading, List<string> userSynonyms)
    {
        var userWord = await getUserWord(userName, word, reading);

        userWord.user_synonyms = userSynonyms;

        await _context.SaveChangesAsync();
    }

    private async Task updateUserWordLevel(UserWord userWord, int level)
    {
        IReviewIntervals ReviewIntervals = new DefaultReviewIntervals();

        level = ReviewIntervals.BindLevel(level);

        userWord.level = level;
        userWord.next_review_day = ReviewIntervals.GetNextReviewDay(level);

        await _context.SaveChangesAsync();
    }

    public async Task IncrementUserWordLevel(string userName, string word, string reading)
    {
        var userWord = await getUserWord(userName, word, reading);
        await updateUserWordLevel(userWord, userWord.level + 1);
    }

    public async Task DecrementUserWordLevel(string userName, string word, string reading)
    {
        var userWord = await getUserWord(userName, word, reading);
        await updateUserWordLevel(userWord, userWord.level - 1);
    }

    public async Task SkipUserWord(string userName, string word, string reading)
    {
        var userWord = await getUserWord(userName, word, reading);
        await updateUserWordLevel(userWord, 999);
    }

    public async Task<string> GenerateWord(string userName)
    {
        var WordGenerator = new WordGenerator(this);
        return await WordGenerator.GenerateWord(userName);
    }
}