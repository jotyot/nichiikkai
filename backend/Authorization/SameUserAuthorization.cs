using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace NIKAPI.Authorization;

public class SameUserAttribute : ServiceFilterAttribute
{
    public SameUserAttribute()
        : base(typeof(SameUserAuthorizationFilter))
    {
    }
}

public class SameUserAuthorizationFilter : IAuthorizationFilter
{
    public SameUserAuthorizationFilter()
    {
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        string? userName = context.HttpContext.User.Identity?.Name;

        if (userName == null)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        string? routeUserName = context.HttpContext.Request.RouteValues["userName"] as string;

        if (routeUserName == null || routeUserName != userName)
        {
            context.Result = new UnauthorizedResult();
            return;
        }
    }
}