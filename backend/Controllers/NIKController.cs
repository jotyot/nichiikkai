using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using NIKAPI.Data;

namespace NIK.Controllers;

[ApiController]
[Route("[controller]")]
public class NIKController : ControllerBase
{

    private readonly NIKService _service;

    public NIKController(NIKService service)
    {
        _service = service;
    }

    [HttpGet("{userName}/selected-levels")]
    [Authorize(Policy = "SameUser")]
    public async Task<ActionResult> GetSelectedLevels([FromRoute] string userName)
    {
        var selectedLevels = await _service.GetSelectedLevels(userName);
        return Ok(selectedLevels);
    }

}
