using Aquadata.Core.Entities.User;
using Aquadata.Infra.EF.Context;

namespace Aquadata.EndToEndTests.Api.Base;

public abstract class BasePersistence
{
  protected readonly ApplicationDbContext _context;
  protected BasePersistence(ApplicationDbContext context)
  {
    _context = context;
  }

  public async Task Insert(UserEntity user)
  {
    await _context.Users.AddAsync(user);
    await _context.SaveChangesAsync();
  }

  public UserEntity GetUserExample()
    => UserEntity.Of(
      "name",
      $"{Guid.NewGuid()}@email.com",
      "password",
      "farmName",
      "farmAddres",
      "profile",
      "phone"
    ).Unwrap();
}
