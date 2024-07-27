namespace NIKAPI.Data;
public class WordGenerator
{
    private readonly NIKService _service;
    private readonly IWordList _wordList;

    public WordGenerator(NIKService service)
    {
        _service = service;
        _wordList = new LocalWordList();
    }

    public async Task<string> GenerateWord(string userName)
    {
        var selectedLevels = await _service.GetSelectedLevels(userName);

        var wordPool = selectedLevels.Select(level => _wordList.GetWordsByLevel(level)).SelectMany(x => x).ToList();
        var learnedWords = (await _service.GetUserWords(userName)).Select(uw => uw.Word).ToList();
        wordPool = wordPool.Except(learnedWords).ToList();

        // Return most common word if available
        var wordFrequencyList = _wordList.GetWordFrequencyList();
        var word = wordFrequencyList.FirstOrDefault(w => wordPool.Contains(w));

        if (word == null)
        {
            var random = new Random();
            word = wordPool[random.Next(wordPool.Count)];
        }

        return word;
    }
}

public interface IWordList
{
    List<string> GetWordFrequencyList();
    List<string> GetWordsByLevel(string level);
}

public class LocalWordList : IWordList
{
    private string _wordFrequencyListPath = "Words/jpwordfreq.txt";
    private string _n5WordsPath = "Words/n5words.txt";
    private string _n4WordsPath = "Words/n4words.txt";
    private string _n3WordsPath = "Words/n3words.txt";
    private string _n2WordsPath = "Words/n2words.txt";
    private string _n1WordsPath = "Words/n1words.txt";

    private List<string> ReadWordsFromFile(string filePath)
    {
        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException($"File not found: {filePath}");
        }

        return File.ReadAllLines(filePath).ToList();
    }

    public List<string> GetWordFrequencyList() => ReadWordsFromFile(_wordFrequencyListPath);
    public List<string> GetN5Words() => ReadWordsFromFile(_n5WordsPath);
    public List<string> GetN4Words() => ReadWordsFromFile(_n4WordsPath);
    public List<string> GetN3Words() => ReadWordsFromFile(_n3WordsPath);
    public List<string> GetN2Words() => ReadWordsFromFile(_n2WordsPath);
    public List<string> GetN1Words() => ReadWordsFromFile(_n1WordsPath);

    public List<string> GetWordsByLevel(string level)
    {
        return level switch
        {
            "N5" => GetN5Words(),
            "N4" => GetN4Words(),
            "N3" => GetN3Words(),
            "N2" => GetN2Words(),
            "N1" => GetN1Words(),
            _ => throw new Exception("Invalid level")
        };
    }
}
