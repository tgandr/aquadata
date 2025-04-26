using Aquadata.Core.Entities.User;

namespace Aquadata.Core.Entities.Payment;

public class PaymentEntity
{
  public Guid Id {get; private set;}
  public string PaymentId {get; private set;}
  public string CustomerId {get;private set;}
  public string CardId {get; private set;}
  public string Email {get; private set;}
  public string IdenticiationType {get; private set;}
  public string IdentificationNumber {get; private set;}
  public DateTime CreatedAt {get; private set;}

  public virtual UserEntity User {get;set;}
  public virtual Guid UserId {get;set;}

  public PaymentEntity(
    string paymentId, 
    string customerId, 
    string cardId, 
    string email,
    string identiciationType,
    string identificationNumber,
    Guid userId)
  {
    Id = Guid.NewGuid();
    CardId = cardId;
    PaymentId = paymentId;
    CustomerId = customerId;
    Email = email;
    UserId = userId;
    IdenticiationType = identiciationType;
    IdentificationNumber = identificationNumber;
    CreatedAt = DateTime.UtcNow;
  }

  public void Update(string paymentId, 
    string customerId, 
    string cardId, 
    string email,
    string identiciationType,
    string identificationNumber)
  {
    CardId = cardId;
    PaymentId = paymentId;
    CustomerId = customerId;
    Email = email;
    IdenticiationType = identiciationType;
    IdentificationNumber = identificationNumber;
    CreatedAt = DateTime.UtcNow;
  }
}
