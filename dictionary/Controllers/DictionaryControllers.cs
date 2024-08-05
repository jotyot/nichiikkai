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

    [HttpGet("words/{word}/{reading}")]
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

    [HttpGet("words")]
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

    [HttpPost("words")]
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

    [HttpPut("words/{word}/{reading}")]
    public async Task<ActionResult> UpdateWord([FromRoute] string word, [FromRoute] string reading, [FromBody] WordData wordData)
    {
        var wordPair = new WordPair { Word = word, Reading = reading };
        try
        {
            await _dictionaryService.UpdateWord(wordPair, wordData);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }

    [HttpDelete("words/{word}/{reading}")]
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