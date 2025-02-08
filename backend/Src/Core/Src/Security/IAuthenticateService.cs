namespace Aquadata.Core.Security;

public interface IAuthenticateService
{
  Task<bool> Authenticate(string email, string password);
  string? GetAuThenticatedUserId();
  bool ValidateToken(string jwt);
  string GenerateToken(string id, string email);
}
