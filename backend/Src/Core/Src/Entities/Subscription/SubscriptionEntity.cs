using Aquadata.Core.Entities.User;
using Aquadata.Core.Enums;

namespace Aquadata.Core.Entities.Subscription;

public class SubscriptionEntity
{
  public Guid Id {get; private set;}
  public string SubscriptionId {get; private set;}
  public DateTime CreatedAt {get;private set;}
  public DateTime ExpiresAt {get; private set;}
  public SubscriptionStatus Status {get;private set;}

  public virtual UserEntity User {get;private set;}
  public virtual Guid UserId {get;set;}

  public SubscriptionEntity
  (
    string subscriptionId,
    Guid userId, 
    SubscriptionStatus status = SubscriptionStatus.Active
  ){
    Id = Guid.NewGuid();
    SubscriptionId = subscriptionId;
    UserId = userId;
    Status = status;
    SetDates();
  }

  public void Update(string subscriptionId, SubscriptionStatus status = SubscriptionStatus.Active)
  {
    Status = status;
    SubscriptionId = subscriptionId;
    SetDates();
  }

  public void Renew()
  {
    Status = SubscriptionStatus.Active;
    SetDates();
  }

  public void ToActive()
    => Status = SubscriptionStatus.Active;

  public void ToCanceled()
    => Status = SubscriptionStatus.Canceled;
  
  private void SetDates()
  {
    CreatedAt = DateTime.UtcNow;
    ExpiresAt = CreatedAt.AddMinutes(2);
  }
}
