using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using NIKAPI.Data;

namespace NIKAPI.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Policy = "SameUser")]
public class NIKController : ControllerBase
{

    private readonly NIKService _service;

    public NIKController(NIKService service)
    {
        _service = service;
    }

    [HttpGet("{userName}/selected-levels")]
    public async Task<ActionResult> GetSelectedLevels([FromRoute] string userName)
    {
        var selectedLevels = await _service.GetSelectedLevels(userName);
        return Ok(selectedLevels);
    }

    [HttpPut("{userName}/selected-levels")]
    public async Task<ActionResult> UpdateSelectedLevels([FromRoute] string userName, [FromBody] List<string> selectedLevels)
    {
        await _service.UpdateSelectedLevels(userName, selectedLevels);
        return Ok();
    }

    [HttpGet("{userName}/words")]

    public async Task<ActionResult> GetUserWords([FromRoute] string userName)
    {
        var userWords = await _service.GetUserWords(userName);
        return Ok(userWords);
    }

    [HttpPost("{userName}/words/{word}/{reading}")]
    public async Task<ActionResult> AddUserWord([FromRoute] string userName, [FromRoute] string word, [FromRoute] string reading)
    {
        await _service.AddUserWord(userName, word, reading);
        return Ok();
    }

    [HttpGet("{userName}/words/{word}/{reading}")]
    public async Task<ActionResult> GetUserWord([FromRoute] string userName, [FromRoute] string word, [FromRoute] string reading)
    {
        try
        {
            var userWord = await _service.GetUserWord(userName, word, reading);
            return Ok(userWord);
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }

    }

    [HttpPut("{userName}/words/{word}/{reading}/increment-level")]
    public async Task<ActionResult> IncrementUserWordLevel([FromRoute] string userName, [FromRoute] string word, [FromRoute] string reading)
    {
        try
        {
            await _service.IncrementUserWordLevel(userName, word, reading);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpPut("{userName}/words/{word}/{reading}/decrement-level")]
    public async Task<ActionResult> DecrementUserWordLevel([FromRoute] string userName, [FromRoute] string word, [FromRoute] string reading)
    {
        try
        {
            await _service.DecrementUserWordLevel(userName, word, reading);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpPut("{userName}/words/{word}/{reading}/skip")]
    public async Task<ActionResult> SkipUserWord([FromRoute] string userName, [FromRoute] string word, [FromRoute] string reading)
    {
        try
        {
            await _service.SkipUserWord(userName, word, reading);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }

    [HttpPut("{userName}/words/{word}/{reading}/synonyms")]
    public async Task<ActionResult> UpdateUserSynonyms([FromRoute] string userName, [FromRoute] string word, [FromRoute] string reading, [FromBody] List<string> userSynonyms)
    {
        try
        {
            await _service.UpdateUserSynonyms(userName, word, reading, userSynonyms);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }

    [HttpGet("{userName}/generate-word")]
    public async Task<ActionResult> GenerateWord([FromRoute] string userName)
    {
        var wordOfTheDay = await _service.GenerateWord(userName);
        return Ok(wordOfTheDay);
    }

}