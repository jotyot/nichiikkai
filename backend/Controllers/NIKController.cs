using Microsoft.AspNetCore.Mvc;
using NIKAPI.Data;
using Microsoft.AspNetCore.Authorization;

namespace NIKAPI.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class NIKController : ControllerBase
{

    private readonly NIKService _service;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public NIKController(NIKService service, IHttpContextAccessor httpContextAccessor)
    {
        _service = service;
        _httpContextAccessor = httpContextAccessor;

    }

    private string getUserName()
    {
        var name = _httpContextAccessor.HttpContext?.User.Identity?.Name;
        if (name == null)
        {
            throw new Exception("No user name found");
        }
        return name;
    }

    [HttpGet("selected-levels")]
    public async Task<ActionResult> GetSelectedLevels()
    {
        var userName = getUserName();
        var selectedLevels = await _service.GetSelectedLevels(userName);
        return Ok(selectedLevels);
    }

    [HttpPut("selected-levels")]
    public async Task<ActionResult> UpdateSelectedLevels([FromBody] List<string> selectedLevels)
    {
        var userName = getUserName();
        await _service.UpdateSelectedLevels(userName, selectedLevels);
        return Ok();
    }

    [HttpGet("words")]

    public async Task<ActionResult> GetUserWords()
    {
        var userName = getUserName();
        var userWords = await _service.GetUserWords(userName);
        return Ok(userWords);
    }

    [HttpPost("words/{word}/{reading}")]
    public async Task<ActionResult> AddUserWord([FromRoute] string word, [FromRoute] string reading)
    {
        var userName = getUserName();
        await _service.AddUserWord(userName, word, reading);
        return Ok();
    }

    [HttpGet("words/{word}/{reading}")]
    public async Task<ActionResult> GetUserWord([FromRoute] string word, [FromRoute] string reading)
    {
        try
        {
            var userName = getUserName();
            var userWord = await _service.GetUserWord(userName, word, reading);
            return Ok(userWord);
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }

    }

    [HttpPut("words/{word}/{reading}/increment-level")]
    public async Task<ActionResult> IncrementUserWordLevel([FromRoute] string word, [FromRoute] string reading)
    {
        try
        {
            var userName = getUserName();
            await _service.IncrementUserWordLevel(userName, word, reading);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpPut("words/{word}/{reading}/decrement-level")]
    public async Task<ActionResult> DecrementUserWordLevel([FromRoute] string word, [FromRoute] string reading)
    {
        try
        {
            var userName = getUserName();
            await _service.DecrementUserWordLevel(userName, word, reading);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpPut("words/{word}/{reading}/skip")]
    public async Task<ActionResult> SkipUserWord([FromRoute] string word, [FromRoute] string reading)
    {
        try
        {
            var userName = getUserName();
            await _service.SkipUserWord(userName, word, reading);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }

    [HttpPut("words/{word}/{reading}/unskip")]
    public async Task<ActionResult> UnskipUserWord([FromRoute] string word, [FromRoute] string reading)
    {
        try
        {
            var userName = getUserName();
            await _service.UnskipUserWord(userName, word, reading);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }

    [HttpPut("words/{word}/{reading}/synonyms")]
    public async Task<ActionResult> UpdateUserSynonyms([FromRoute] string word, [FromRoute] string reading, [FromBody] List<string> userSynonyms)
    {
        try
        {
            var userName = getUserName();
            await _service.UpdateUserSynonyms(userName, word, reading, userSynonyms);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }
}