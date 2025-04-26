using Aquadata.Core.Entities.User;

namespace Aquadata.Application.Interfaces;

public interface IAuthService
{
  Task<(bool, UserEntity?)> Authenticate(string email, string password);
}
