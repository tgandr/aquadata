using Aquadata.Core.Entities.Payment;

namespace Aquadata.Core.Interfaces.Repository;

public interface IPaymentRepository
{
  Task Create(PaymentEntity command);
  Task<PaymentEntity?> Get(string paymentId);
}
