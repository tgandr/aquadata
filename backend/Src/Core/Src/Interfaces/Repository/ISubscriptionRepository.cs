using Aquadata.Core.Entities.Subscription;

namespace Aquadata.Core.Interfaces.Repository;

public interface ISubscriptionRepository
{
  Task Create(SubscriptionEntity signature);
  Task<SubscriptionEntity?> GetById(Guid id);
  Task<bool> IsUserWithSubscriptionActive(Guid userId);
  Task UpdateExpired();
}
