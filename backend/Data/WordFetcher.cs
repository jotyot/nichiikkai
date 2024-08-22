namespace NIKAPI.Data;

public interface IWordFetcher
{
    public Task<List<WordPair>> FetchWords(List<string> selectedLevels);
}
public class DefaultWordFetcher : IWordFetcher
{
    public Task<List<WordPair>> FetchWords(List<string> selectedLevels)
    {
        // string url = "https://dictionary-iwritdb2va-uw.a.run.app/Dictionary/?levels=" + string.Join(",", selectedLevels);
        throw new NotImplementedException();
    }
}
