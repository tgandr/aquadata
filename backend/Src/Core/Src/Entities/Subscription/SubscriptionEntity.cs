using Aquadata.Core.Enums;

namespace Aquadata.Core.Entities.Subscription;

public class SubscriptionEntity
{
  public Guid Id {get;private set;}
  public DateTime CreatedAt {get;private set;}
  public DateTime NextDueDate {get; private set;}
  public SubscriptionStatus Status {get;private set;}

  public virtual Guid UserId {get;set;}

  public SubscriptionEntity(Guid userId)
  {
    Id = Guid.NewGuid();
    CreatedAt = DateTime.UtcNow;
    NextDueDate = CreatedAt.AddMinutes(2);
    Status = SubscriptionStatus.Active;
    UserId = userId;
  }

  public void ToExpired()
    => Status = SubscriptionStatus.Expired;

  public void ToActive()
    => Status = SubscriptionStatus.Active;
}
