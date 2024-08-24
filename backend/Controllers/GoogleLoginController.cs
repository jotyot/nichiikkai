using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
namespace NIKAPI.Data;

[ApiController]
[Route("[controller]")]
public class GoogleLoginController : ControllerBase
{
    private readonly SignInManager<NIKUser> _signInManager;

    public GoogleLoginController(SignInManager<NIKUser> signInManager)
    {
        _signInManager = signInManager;
    }

    [HttpGet]
    public IActionResult InitiateGoogleLogin()
    {
        return Challenge(new AuthenticationProperties { RedirectUri = "/" }, "Google");
    }
}