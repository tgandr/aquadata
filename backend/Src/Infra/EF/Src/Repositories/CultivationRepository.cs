using Aquadata.Core.Entities.Biometric;
using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Feed;
using Aquadata.Core.Entities.Fertilizer;
using Aquadata.Core.Entities.Harvest;
using Aquadata.Core.Entities.Objective;
using Aquadata.Core.Entities.Water;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.Infra.EF.Repositories;

public class CultivationRepository: ICultivationRepository
{
  private readonly ApplicationDbContext _context;

  public CultivationRepository(ApplicationDbContext context)
    => _context = context;

  public async Task AddBiometric(BiometricEntity biometric)
    => await _context.Biometrics.AddAsync(biometric);

  public async Task AddFeed(FeedEntity feed)
    => await _context.Feed.AddAsync(feed);

  public async Task AddFertilizer(FertilizerEntity fertilizer)
  => await _context.Fertilizers.AddAsync(fertilizer);

  public async Task AddHarvest(HarvestEntity harvest)
    => await _context.Harvests.AddAsync(harvest);

  public async Task AddObjective(ObjectiveEntity objective)
    => await _context.Objectives.AddAsync(objective);
  
  public async Task AddWater(WaterEntity water)
    => await _context.Waters.AddAsync(water);
  
  public async Task<bool> Exists(Guid userId, Guid cultivationId)
  => await _context.Ponds
    .Where(p => p.UserId == userId)
    .SelectMany(p => p.Cultivations)
    .AnyAsync(c => c.Id == cultivationId);

  public async Task<CultivationEntity?> Get(Guid id)
  => await _context.Cultivations.FirstOrDefaultAsync(e => e.Id == id);
}
