using Aquadata.Core.Entities.User;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.EndToEndTests.Api.User.Common;

public class UserPersistence
{
  private readonly ApplicationDbContext _context;

  public UserPersistence(ApplicationDbContext context)
    => _context = context;

  public async Task<UserEntity?> GetById(Guid id)
    => await _context.Users
      .AsNoTracking()
      .FirstOrDefaultAsync(e => e.Id == id);

  public async Task Insert(UserEntity entity)
  {
    await _context.Users.AddAsync(entity);
    await _context.SaveChangesAsync();
  }
}
