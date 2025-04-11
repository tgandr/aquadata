using System.Security.Cryptography;
using System.Text;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.User;
using Aquadata.Core.Interfaces.Repository;

namespace Aquadata.Infra.Security.BasicAuth.Services;

public class BasicAuthService : IAuthService
{
  private readonly IUserRepository _userRepository;
  private readonly ISubscriptionRepository _SubscriptionRepository;

  public BasicAuthService(
    IUserRepository userRepository,
    ISubscriptionRepository SubscriptionRepository
  )
  {
    _SubscriptionRepository = SubscriptionRepository;
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
}
