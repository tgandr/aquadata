using Aquadata.Core.Entities.Payment;
using Aquadata.Core.Util;

namespace Aquadata.Application.Interfaces;

public interface IPaymentService<TRequest, TResult>
{
  Task<TResult> CreatePaymentAsync(TRequest command);
  Task<TResult> GetPaymentAsync(string paymentId);
  PaymentEntity ToPaymentEntity(TResult payment, Guid userId);
}
