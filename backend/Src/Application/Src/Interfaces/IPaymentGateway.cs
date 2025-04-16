using Aquadata.Application.UseCases.Payment.Create;
using Aquadata.Core.Util;

namespace Aquadata.Application.Interfaces;

public interface IPaymentGateway
{
  Task<Result<PaymentOutput>> CreatePaymentAsync(CreatePaymentInput command);
  Task<PaymentOutput> GetPaymentAsync(string paymentId);
  Task<string> GenerateCardToken(string customerId, string cardId);
  Task<Result<(string customerId, string cardId)>> SaveCustomerAndCardIfNotExists(
    string customerEmail, 
    string identiciationType, 
    string identificationNumber,
    string cardToken
  );
}


