using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.PaymentGateway.CreateSubscription;
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

  public async Task Create(SubscriptionEntity entity)
  {
    var subscription = await _context.Subscriptions
    .FirstOrDefaultAsync(s => s.UserId == entity.UserId);

    if (subscription is null) {
      _context.Subscriptions.Add(entity);
    }
    else
    {
      subscription.Update(entity.SubscriptionId, entity.Status);
      _context.Subscriptions.Update(subscription);
    }
    await _context.SaveChangesAsync();
  }

  public async Task Renew(string subscriptionId)
  {
    var subscription = await _context.Subscriptions
      .FirstOrDefaultAsync(s => s.SubscriptionId == subscriptionId);

    if (subscription is null) return;

    subscription.Renew();
    _context.Subscriptions.Update(subscription);
    await _context.SaveChangesAsync();
  }
  
  public Task<SubscriptionEntity?> GetById(string subscriptionId)
    => _context.Subscriptions.AsNoTracking()
    .Include(s => s.User)
    .FirstOrDefaultAsync(x => x.SubscriptionId == subscriptionId);

  public async Task<SubscriptionEntity?> GetByUserId(Guid userId)
    => await _context.Subscriptions.AsNoTracking()
      .Include(s => s.User)
      .FirstOrDefaultAsync(s => s.UserId == userId);

  public async Task<ICollection<SubscriptionEntity>> GetCancelledInBatches(
    int page = 1, 
    int batchSize = 100)
  {
    return await _context.Subscriptions
    .AsNoTracking()
    .Where(s => s.Status == SubscriptionStatus.Canceled && s.ExpiresAt < DateTime.UtcNow)
    .Include(s => s.User)
    .OrderBy(s => s.Id)
    .Skip((page - 1) * batchSize)
    .Take(batchSize)
    .ToListAsync();
  }

  public async Task<bool> Exists(string subscriptionId)
    => await _context.Subscriptions
      .AnyAsync(s => s.SubscriptionId == subscriptionId);

  public async Task Cancel(string subscriptionId)
  {
    var res = await _context.Subscriptions
      .FirstOrDefaultAsync(s => s.SubscriptionId == subscriptionId);

    if (res is null) return;
    res.ToCanceled();

    _context.Subscriptions.Update(res);
    await _context.SaveChangesAsync();
  }

  public async Task<SubscriptionStatus?> GetStatus(Guid userId)
    => await _context.Subscriptions
      .AsNoTracking()
      .Where(s => s.UserId == userId)
      .Select(s => s.Status)
      .FirstOrDefaultAsync();
  
}
