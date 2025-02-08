using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Entities.User;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

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

  public async Task<PondEntity?> GetById(Guid id)
    => await _context.Ponds.AsNoTracking()
      .Include(p => p.Cultivations)
      .FirstOrDefaultAsync(e => e.Id == id);

  public async Task Insert(PondEntity pond)
  {
    await _context.Ponds.AddAsync(pond);
    await _context.SaveChangesAsync();
  }

  public async Task Insert(CultivationEntity cultivation)
  {
    await _context.Cultivations.AddAsync(cultivation);
    await _context.SaveChangesAsync();
  }
}
