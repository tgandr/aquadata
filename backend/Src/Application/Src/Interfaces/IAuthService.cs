using Aquadata.Core.Entities.Manager;
using Aquadata.Core.Entities.User;

namespace Aquadata.Application.Interfaces;

public interface IAuthService
{
  Task<(bool, UserEntity?)> Authenticate(string email, string password);
  Task<(bool, ManagerEntity?)> AuthenticateManager(string phone, string password);
}
