using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Payment.Create;
using Aquadata.Core.Entities.Subscription;
using Aquadata.Core.Enums;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.Infra.EF.Repositories;

public class SubscriptionRepository : ISubscriptionRepository
{
  private readonly ApplicationDbContext _context;

  public SubscriptionRepository(
    ApplicationDbContext context
  )
  {
    _context = context;
  }
  
  public async Task CreateOrRenew(Guid userId)
  {
    var subscription = await _context.Subscriptions
    .FirstOrDefaultAsync(s => s.UserId == userId);

    if (subscription is null) 
      _context.Subscriptions.Add(new SubscriptionEntity(userId));
    else 
    {
      subscription.Renew();
      _context.Subscriptions.Update(subscription);
    }

    await _context.SaveChangesAsync();
  }
  
  public Task<SubscriptionEntity?> GetById(Guid id)
    => _context.Subscriptions.AsNoTracking()
    .FirstOrDefaultAsync(x => x.Id == id);

  public async Task<bool> IsUserWithSubscriptionActive(Guid userId)
    => await _context.Subscriptions
      .AnyAsync(x => 
        x.UserId == userId && 
        x.Status == SubscriptionStatus.Active);

  public async Task<ICollection<SubscriptionEntity>> GetExpiredInBatches(
    int page = 1, 
    int batchSize = 100)
  {
    return await _context.Subscriptions
    .AsNoTracking()
    .Where(s => s.Status == SubscriptionStatus.Active && s.ExpiresAt < DateTime.UtcNow)
    .Include(s => s.User)
    .OrderBy(s => s.Id)
    .Skip((page - 1) * batchSize)
    .Take(batchSize)
    .ToListAsync();
  }

  public async Task<bool> Exists(Guid userId)
    => await _context.Subscriptions
      .AnyAsync(s => s.UserId == userId);

  public async Task ToExpired(Guid userId)
    => await _context.Subscriptions.Where(s => s.UserId == userId)
      .ExecuteUpdateAsync(setter => 
        setter.SetProperty(s => s.Status, SubscriptionStatus.Expired)
    );
}
