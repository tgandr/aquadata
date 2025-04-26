using Aquadata.Core.Entities.Payment;

namespace Aquadata.Core.Interfaces.Repository;

public interface IPaymentRepository
{
  Task CreateOrUpdate(PaymentEntity command);
  Task<PaymentEntity?> GetByPaymentId(string paymentId);
  Task<PaymentEntity?> GetByUserId(Guid userId);
}
