using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Entities.User;
using Aquadata.EndToEndTests.Api.Base;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.EndToEndTests.Api.Pond.Common;

public class PondPersistence: BasePersistence
{
  public PondPersistence(ApplicationDbContext context)
    :base(context){}

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
