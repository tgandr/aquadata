using Aquadata.Application.UseCases.PaymentGateway.Common;
using Aquadata.Application.UseCases.PaymentGateway.CreateSubscription;
using Aquadata.Core.Util;

namespace Aquadata.Application.Interfaces;

public interface IPaymentGateway
{
  Task<Result<SubscriptionOutput>> CreateSubscription(CreateSubscriptionInput command);
  Task<Result<object>> CancelSubscription(string subscriptionId);
  Task<PaymentOutput?> GetPayment(string id); 
}


