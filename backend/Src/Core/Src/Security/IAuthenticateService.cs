using Aquadata.Core.Entities.User;

namespace Aquadata.Core.Security;

public interface IAuthenticateService
{
  Task<(bool, UserEntity?)> Authenticate(string email, string password);
  string? GetAuThenticatedUserId();
  bool ValidateToken(string jwt);
  string GenerateToken(string id, string email);
}
