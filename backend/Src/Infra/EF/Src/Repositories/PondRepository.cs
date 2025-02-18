using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.Infra.EF.Repositories;

public class PondRepository : IPondRepository
{
  private readonly ApplicationDbContext _dbContext;

  public PondRepository(ApplicationDbContext dbContext)
    => _dbContext = dbContext;
  

  public async Task Deactivate(PondEntity pond, CancellationToken cancellationToken)
  {
    pond.Deactivate();
    await Update(pond, cancellationToken);
  }

  public async Task<PondEntity?> Get(Guid id, CancellationToken cancellationToken)
    => await _dbContext.Ponds.AsNoTracking()
    .Include(p => p.Cultivations)
    .FirstOrDefaultAsync(
      x => x.Id == id && x.IsActive, cancellationToken
    );

  public async Task Insert(PondEntity aggregate, CancellationToken cancellationToken)
    => await _dbContext.Ponds.AddAsync(aggregate, cancellationToken);

  public Task Update(PondEntity aggregate, CancellationToken cancellationToken)
    => Task.FromResult(_dbContext.Ponds.Update(aggregate));

  public async Task CreateCultivation(CultivationEntity cultivation, CancellationToken cancellationToken)
    => await _dbContext.Cultivations.AddAsync(cultivation, cancellationToken);

  public async Task<bool> Exists(Guid userId, Guid pondId)
    => await _dbContext.Ponds.AnyAsync(
      p => p.Id == pondId && 
      p.UserId == userId
    );

}
