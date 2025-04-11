using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using Aquadata.Application.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Aquadata.Infra.Security.BasicAuth;

public class BasicAuthHandler: AuthenticationHandler<AuthenticationSchemeOptions>
{
  private readonly IAuthService _authService;
  public BasicAuthHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder,
    ISystemClock clock,
    IAuthService authService)
    : base(options, logger, encoder, clock)
  {
    _authService = authService;
  }

  protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
  {
    var authHeader = Request.Headers["Authorization"].ToString();

    if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Basic "))
    {
      return AuthenticateResult.Fail("Unauthorized");
    }

    var token = authHeader.Substring("Basic ".Length).Trim();
    var credentialAsString = Encoding.UTF8.GetString(Convert.FromBase64String(token));
    var credentials = credentialAsString.Split(':', 2);
    if (credentials.Length != 2)
    {
      return AuthenticateResult.Fail("Unauthorized");
    }

    var username = credentials[0];
    var password = credentials[1];
    var (isAuth, user) = await _authService.Authenticate(username, password);
    if (!isAuth)
    {
      return AuthenticateResult.Fail("Unauthorized");
    }


    var claims = new[] { 
      new Claim(ClaimTypes.NameIdentifier, user!.Id.ToString()),
      new Claim(ClaimTypes.Email, user.Email),
    };
    
    var identity = new ClaimsIdentity(claims, Scheme.Name);
    var principal = new ClaimsPrincipal(identity);
    var ticket = new AuthenticationTicket(principal, Scheme.Name);
    return AuthenticateResult.Success(ticket);
  }
}
