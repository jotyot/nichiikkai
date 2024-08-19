using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

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
    private string? _apiKey;
    public ApiKeyValidator()
    {
        _apiKey = Environment.GetEnvironmentVariable("DICTIONARY_API_KEY");
    }

    public bool IsValid(string apiKey)
    {
        return _apiKey == apiKey;
    }
}

public interface IApiKeyValidator
{
    bool IsValid(string apiKey);
}