using Aquadata.Core.Entities.Subscription;

namespace Aquadata.Core.Interfaces.Repository;

public interface ISubscriptionRepository
{
  Task CreateOrRenew(Guid userId);
  Task ToExpired(Guid userId);
  Task<bool> Exists(Guid userId); 
  Task<SubscriptionEntity?> GetById(Guid id);
  Task<bool> IsUserWithSubscriptionActive(Guid userId);
  Task<ICollection<SubscriptionEntity>> GetExpiredInBatches(
    int page = 1, 
    int batchSize = 100);
}
