using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Pond;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.EndToEndTests.Api.Cultivation.Common;

public class CultivationPersistence
{
  private readonly ApplicationDbContext _context;

  public CultivationPersistence(ApplicationDbContext context)
    => _context = context;

  public async Task Insert(PondEntity pond)
  {
    _context.Ponds.Add(pond);
    await _context.SaveChangesAsync();
  }
  public async Task Insert(CultivationEntity pond)
  {
    _context.Cultivations.Add(pond);
    await _context.SaveChangesAsync();
  }

  public async Task<CultivationEntity?> GetById(Guid id)
    => await _context.Cultivations
    .Include(c => c.Objective)
    .FirstOrDefaultAsync(c => c.Id == id);
}
