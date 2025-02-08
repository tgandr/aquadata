using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Objective;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.Infra.EF.Repositories;

public class CultivationRepository: ICultivationRepository
{
  private readonly ApplicationDbContext _context;

  public CultivationRepository(ApplicationDbContext context)
    => _context = context;

  public async Task AddObjective(ObjectiveEntity objective)
    => await _context.Objectives.AddAsync(objective);

  public async Task<bool> Exists(string userId, string cultivationId)
    => await _context.Ponds
      .Where(p => p.UserId.ToString() == userId)
      .SelectMany(p => p.Cultivations)
      .AnyAsync(c => c.Id.ToString() == cultivationId);
  

    public async Task<CultivationEntity?> Get(Guid id)
    => await _context.Cultivations.FirstOrDefaultAsync(e => e.Id == id);
}
