using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using NIKAPI.Data;

namespace NIK.Controllers;

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

    [HttpPost("{userName}/words")]
    public async Task<ActionResult> AddUserWord([FromRoute] string userName, [FromBody] string word)
    {
        await _service.AddUserWord(userName, word);
        return Ok();
    }

    [HttpGet("{userName}/words/{word}")]
    public async Task<ActionResult> GetUserWord([FromRoute] string userName, [FromRoute] string word)
    {
        try
        {
            var userWord = await _service.GetUserWord(userName, word);
            return Ok(userWord);
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }

    }

    [HttpPut("{userName}/words/{word}/increment-level")]
    public async Task<ActionResult> IncrementUserWordLevel([FromRoute] string userName, [FromRoute] string word)
    {
        try
        {
            await _service.IncrementUserWordLevel(userName, word);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }

    [HttpPut("{userName}/words/{word}/decrement-level")]
    public async Task<ActionResult> DecrementUserWordLevel([FromRoute] string userName, [FromRoute] string word)
    {
        try
        {
            await _service.DecrementUserWordLevel(userName, word);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpPut("{userName}/words/{word}/synonyms")]
    public async Task<ActionResult> UpdateUserSynonyms([FromRoute] string userName, [FromRoute] string word, [FromBody] List<string> userSynonyms)
    {
        try
        {
            await _service.UpdateUserSynonyms(userName, word, userSynonyms);
            return Ok();
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }

}