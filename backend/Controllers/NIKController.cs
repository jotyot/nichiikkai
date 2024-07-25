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

}
