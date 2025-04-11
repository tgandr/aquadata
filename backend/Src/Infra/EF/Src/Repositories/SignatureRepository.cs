using Aquadata.Core.Entities.Subscription;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.Infra.EF.Repositories;

public class SubscriptionRepository : ISubscriptionRepository
{
  private readonly ApplicationDbContext _context;

  public SubscriptionRepository(ApplicationDbContext context)
  {
    _context = context;
  }
  
  public Task Create(SubscriptionEntity signature)
  {
    _context.Signatures.Add(signature);
    return _context.SaveChangesAsync();
  }

  public Task<SubscriptionEntity?> GetById(Guid id)
    => _context.Signatures.AsNoTracking()
    .FirstOrDefaultAsync(x => x.Id == id);

  public async Task<bool> IsUserWithSubscriptionActive(Guid userId)
    => await _context.Signatures
      .AnyAsync(x => 
        x.UserId == userId && 
        x.Status == Core.Enums.SubscriptionStatus.Active);

  public async Task UpdateExpired()
  {
    await _context.Signatures
      .Where(s => 
        s.Status == Core.Enums.SubscriptionStatus.Active &&
        s.NextDueDate < DateTime.UtcNow
      )
      .ExecuteUpdateAsync(setter => 
        setter.SetProperty(s => s.Status, Core.Enums.SubscriptionStatus.Expired)
      );
  }
}
