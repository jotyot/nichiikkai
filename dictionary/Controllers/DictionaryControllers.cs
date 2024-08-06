using Microsoft.AspNetCore.Mvc;
using DictionaryAPI.Data;

namespace DictionaryAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class DictionaryController : ControllerBase
{
    private readonly DictionaryService _dictionaryService;

    public DictionaryController(DictionaryService dictionaryService)
    {
        _dictionaryService = dictionaryService;
    }

    [HttpGet("{word}/{reading}")]
    public async Task<ActionResult<WordData>> GetWordData([FromRoute] string word, [FromRoute] string reading)
    {
        var wordPair = new WordPair { Word = word, Reading = reading };
        try
        {
            var result = await _dictionaryService.GetWordData(wordPair);
            return result;
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<WordDataLimited>>> GetWords([FromQuery] List<string> levels, [FromQuery] string jlptOrder = "ascending", [FromQuery] string orderBy = "alphabetical")
    {
        try
        {
            if (levels.Count == 0)
            {
                levels = new List<string> { "N5", "N4", "N3", "N2", "N1" };
            }
            var result = await _dictionaryService.GetWords(levels, jlptOrder, orderBy);
            return result;
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }

    [HttpPost]
    public async Task<ActionResult> AddWord([FromBody] WordData wordData)
    {
        try
        {
            await _dictionaryService.AddWordData(wordData);
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("{word}/{reading}")]
    public async Task<ActionResult> DeleteWord([FromRoute] string word, [FromRoute] string reading)
    {
        var wordPair = new WordPair { Word = word, Reading = reading };
        try
        {
            await _dictionaryService.DeleteWord(wordPair);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }
}