using System.Security.Claims;
using Aquadata.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Aquadata.Infra.Security.Services;

public class AuthenticatedUserService : IAuthenticatedUserService
{
  private readonly IHttpContextAccessor _httpAcessor;

  public AuthenticatedUserService(IHttpContextAccessor httpAcessor) 
    => _httpAcessor = httpAcessor;
    
  public string? GetUserId()
  {
    return _httpAcessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
  }
}
