using Aquadata.Application.Dtos.MercadoPago;

namespace Aquadata.Application.Interfaces;

public interface IPaymentService<TRequest, TResult>
{
  Task<TResult> CreatePaymentAsync(TRequest command);
}
