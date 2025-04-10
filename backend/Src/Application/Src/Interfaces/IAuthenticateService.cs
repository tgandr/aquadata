using Aquadata.Core.Entities.User;

namespace Aquadata.Application.Interfaces;

public interface IAuthenticateService
{
  Task<(bool, UserEntity?)> Authenticate(string email, string password);
  string? GetAuthenticatedUserId();
  bool ValidateToken(string jwt);
  string GenerateToken(string id, string email);
}
