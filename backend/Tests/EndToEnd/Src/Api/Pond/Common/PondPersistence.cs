using Aquadata.Core.Entities.User;
using Aquadata.Infra.EF.Context;

namespace Aquadata.EndToEndTests.Api.Pond.Common;

public class PondPersistence
{
  private readonly ApplicationDbContext _context;

  public PondPersistence(ApplicationDbContext context)
    => _context = context;

  public async Task AddUser(UserEntity user)
  {
    await _context.Users.AddAsync(user);
    await _context.SaveChangesAsync();
  }
}
