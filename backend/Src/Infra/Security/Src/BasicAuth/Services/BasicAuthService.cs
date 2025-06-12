using System.Security.Cryptography;
using System.Text;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Manager;
using Aquadata.Core.Entities.User;
using Aquadata.Core.Interfaces.Repository;

namespace Aquadata.Infra.Security.BasicAuth.Services;

public class BasicAuthService : IAuthService
{
  private readonly IUserRepository _userRepository;
  private readonly IManagerRepository _managerRepository;

  public BasicAuthService(
    IUserRepository userRepository,
    IManagerRepository managerRepository
  )
  {
    _managerRepository = managerRepository;
    _userRepository = userRepository;
  }

  public async Task<(bool, UserEntity?)> Authenticate(string email, string password)
  {
    var user = await _userRepository.GetByEmail(email);

    if (user == null)
      return (false, null);

    using var hmac = new HMACSHA256(user.PasswordSalt);
    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

    for (int i = 0; i < computedHash.Length; i++)
    {
      if (computedHash[i] != user.PasswordHash![i])
        return (false, null);
    }

    return (true, user);
  }
  public async Task<(bool, ManagerEntity?)> AuthenticateManager(string phone, string password)
  {
    var manager = await _managerRepository.GetByPhone(phone);

    if (manager == null)
      return (false, null);

    using var hmac = new HMACSHA256(manager.PasswordSalt);
    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

    for (int i = 0; i < computedHash.Length; i++)
    {
      if (computedHash[i] != manager.PasswordHash![i])
        return (false, null);
    }

    return (true, manager);
  }
}
