using Aquadata.Core.Entities.Subscription;
using Aquadata.Core.Enums;

namespace Aquadata.Core.Interfaces.Repository;

public interface ISubscriptionRepository
{
  Task Create(SubscriptionEntity subscription);
  Task Renew(string subscriptionId);
  Task Cancel(string subscriptionId);
  Task<bool> Exists(string subscriptionId);
  Task<SubscriptionStatus?> GetStatus(Guid userId);
  Task<SubscriptionEntity?> GetBySubscriptionId(string subscriptionId);
  Task<SubscriptionEntity?> GetByUserId(Guid userId);
  Task<ICollection<SubscriptionEntity>> GetCancelledInBatches(
    int page = 1, 
    int batchSize = 100);
}
