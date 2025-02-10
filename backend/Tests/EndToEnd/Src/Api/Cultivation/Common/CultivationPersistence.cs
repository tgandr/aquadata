using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Pond;
using Aquadata.EndToEndTests.Api.Base;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.EndToEndTests.Api.Cultivation.Common;

public class CultivationPersistence: BasePersistence
{
  public CultivationPersistence(ApplicationDbContext context)
  :base(context){}

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
    .Include(c => c.Biometrics)
    .Include(c => c.WaterParams)
    .FirstOrDefaultAsync(c => c.Id == id);
}
