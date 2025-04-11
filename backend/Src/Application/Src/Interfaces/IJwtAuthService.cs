namespace Aquadata.Application.Interfaces;

public interface IJwtAuthService: IAuthService
{  
  string? GetAuthenticatedUserId();
  bool ValidateToken(string jwt);
  string GenerateToken(string id, string email);
}
