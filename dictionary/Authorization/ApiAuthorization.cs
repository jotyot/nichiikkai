using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using DotNetEnv;

namespace DictionaryAPI.Authorization;
public class ApiKeyAttribute : ServiceFilterAttribute
{
    public ApiKeyAttribute()
        : base(typeof(ApiKeyAuthorizationFilter))
    {
    }
}

public class ApiKeyAuthorizationFilter : IAuthorizationFilter
{
    private const string ApiKeyHeaderName = "ApiKey";

    private readonly IApiKeyValidator _apiKeyValidator;

    public ApiKeyAuthorizationFilter(IApiKeyValidator apiKeyValidator)
    {
        _apiKeyValidator = apiKeyValidator;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        string? apiKey = context.HttpContext.Request.Headers[ApiKeyHeaderName];

        if (apiKey == null)
        {
            context.Result = new BadRequestResult();
        }
        else if (!_apiKeyValidator.IsValid(apiKey))
        {
            context.Result = new UnauthorizedResult();
        }
    }
}

public class ApiKeyValidator : IApiKeyValidator
{
    private string _localApiKey;
    public ApiKeyValidator()
    {
        Env.Load();
        _localApiKey = Env.GetString("DICTIONARY_API_KEY");
    }
    public bool IsValid(string apiKey)
    {
        return _localApiKey == apiKey;
    }
}

public interface IApiKeyValidator
{
    bool IsValid(string apiKey);
}