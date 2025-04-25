using Aquadata.Application.Interfaces;

namespace Aquadata.Application.UseCases.PaymentGateway.CreateSubscription;

public class CreateSubscriptionInput: IUseCaseRequest<SubscriptionOutput>
{
  public string PayerEmail {get;set;}
}
