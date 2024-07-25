using Microsoft.AspNetCore.Authorization;
using NIKAPI.Data;

public class DocumentAuthorizationHandler :
    AuthorizationHandler<SameAuthorRequirement, NIKUser>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
                                                   SameAuthorRequirement requirement,
                                                   NIKUser resource)
    {
        if (context.User.Identity?.Name == resource.Id)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}

public class SameAuthorRequirement : IAuthorizationRequirement { }