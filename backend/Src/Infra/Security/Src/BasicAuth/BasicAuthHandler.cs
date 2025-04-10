using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using Aquadata.Core.Entities.User;
using Aquadata.Application.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Aquadata.Infra.Security.BasicAuth;

public class BasicAuthHandler: AuthenticationHandler<AuthenticationSchemeOptions>
{
  public BasicAuthHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder,
    ISystemClock clock)
    : base(options, logger, encoder, clock)
  {}

  protected override Task<AuthenticateResult> HandleAuthenticateAsync()
  {
    if (!Request.Headers.ContainsKey("Authorization"))
    {
      return Task.FromResult(AuthenticateResult.Fail("Unauthorized"));
    }

    var authHeader = Request.Headers["Authorization"].ToString();

    if (string.IsNullOrEmpty(authHeader))
    {
      return Task.FromResult(AuthenticateResult.Fail("Unauthorized"));
    }

    if (!authHeader.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
    {
      return Task.FromResult(AuthenticateResult.Fail("Unauthorized"));
    }

    var token = authHeader.Substring("Basic ".Length).Trim();
    var credentialAsString = Encoding.UTF8.GetString(Convert.FromBase64String(token));
    var credentials = credentialAsString.Split(':', 2);
    if (credentials.Length != 2)
    {
      return Task.FromResult(AuthenticateResult.Fail("Unauthorized"));
    }
    var username = credentials[0];
    var password = credentials[1];
    if (username != "admin" || password != "password")
    {
      return Task.FromResult(AuthenticateResult.Fail("Authentication failed"));
    }

    var claims = new[] { new Claim(ClaimTypes.NameIdentifier, username) };
    var identity = new ClaimsIdentity(claims, Scheme.Name);
    var principal = new ClaimsPrincipal(identity);
    var ticket = new AuthenticationTicket(principal, Scheme.Name);
    return Task.FromResult(AuthenticateResult.Success(ticket));
  }
}
