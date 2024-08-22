using System.Text.Json;

namespace NIKAPI.Data;

public interface IWordFetcher
{
    public Task<List<WordPair>> FetchWords(List<string> selectedLevels);
}
public class DefaultWordFetcher : IWordFetcher
{
    public async Task<List<WordPair>> FetchWords(List<string> selectedLevels)
    {
        var client = new HttpClient();
        List<WordPair>? words;
        var page = 1;

        while (true)
        {
            string url = "https://dictionary-iwritdb2va-uw.a.run.app/Dictionary/?jlptOrder=none&orderBy=frequency&levels=" + string.Join("&levels=", selectedLevels) + "&page=" + page;

            var response = await client.GetAsync(url);
            var content = await response.Content.ReadAsStringAsync();
            words = JsonSerializer.Deserialize<List<WordPair>>(content);

            if (words == null)
                throw new Exception("Unexpected error fetching words");

            if (words.Count > 0)
                break;

            page++;
        }
        return words;
    }
}
