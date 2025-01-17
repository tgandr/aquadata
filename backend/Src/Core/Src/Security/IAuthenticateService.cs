namespace Aquadata.Core.Security;

public interface IAuthenticateService
{
  Task<bool> Authenticate(string email, string password);
  bool ValidateToken(string jwt);
  string GenerateToken(string id, string email);
}
