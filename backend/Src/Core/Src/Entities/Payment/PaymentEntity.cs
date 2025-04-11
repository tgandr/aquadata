using Aquadata.Core.Enums;

namespace Aquadata.Core.Entities.Payment;

public class PaymentEntity
{
  public string Id {get; private set;}
  public PaymentStatus Status {get; private set;}
  public DateTime CreatedAt {get; private set;}
  public virtual Guid UserId {get;set;}
  public PaymentEntity(string id, PaymentStatus status, Guid userId)
  {
    Id = id;
    Status = status;
    UserId = userId;
    CreatedAt = DateTime.UtcNow;
  }
}
