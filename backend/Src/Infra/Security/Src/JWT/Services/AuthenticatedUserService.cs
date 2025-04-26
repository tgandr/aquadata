using System.Security.Claims;
using Aquadata.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Aquadata.Infra.Security.JWT.Services;

public class AuthenticatedUserService : IAuthenticatedUserService
{
  private readonly IHttpContextAccessor _httpAcessor;

  public AuthenticatedUserService(IHttpContextAccessor httpAcessor) 
    => _httpAcessor = httpAcessor;

  public string GetUserEmail()
  {
    return _httpAcessor.HttpContext?
      .User?.FindFirst(ClaimTypes.Email)?.Value ?? "";
  }

  public Guid GetUserId()
  {
    var res = _httpAcessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? Guid.Empty.ToString();

    return Guid.Parse(res);
  }
}
