using Microsoft.AspNetCore.Mvc;
using DictionaryAPI.Data;
using DictionaryAPI.Authorization;

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
        var wordPair = new WordBase { word = word, reading = reading, jlpt_level = "" };
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
    public async Task<ActionResult<List<WordBase>>> GetWords([FromQuery] List<string> levels, [FromQuery] string jlptOrder = "ascending", [FromQuery] string orderBy = "alphabetical", [FromQuery] int page = 1)
    {
        try
        {
            if (levels.Count == 0)
            {
                levels = new List<string> { "N5", "N4", "N3", "N2", "N1" };
            }
            var result = await _dictionaryService.GetWords(levels, jlptOrder, orderBy, page);
            return result;
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }

    [ApiKey]
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

    [ApiKey]
    [HttpDelete("{word}/{reading}")]
    public async Task<ActionResult> DeleteWord([FromRoute] string word, [FromRoute] string reading)
    {
        var wordPair = new WordBase { word = word, reading = reading, jlpt_level = "" };
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