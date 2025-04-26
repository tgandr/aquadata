using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.PaymentGateway.CreateSubscription;
using Aquadata.Core.Entities.Payment;
using Aquadata.Core.Interfaces.Repository;

namespace Aquadata.Infra.Payments.MercadoPago.Jobs;

public class RenewSubscriptionsJob
{
  private readonly ISubscriptionRepository _repository;
  private readonly ICouchdbService _couchDb;
  private readonly IPaymentGateway _gateway;

  public RenewSubscriptionsJob(
    ISubscriptionRepository repository,
    ICouchdbService couchdDb,
    IPaymentGateway gateway
  )
  {
    _couchDb = couchdDb;
    _gateway = gateway;
    _repository = repository;
  }

  public async Task Execute()
  {
    int page = 1;
    var expireds = await _repository.GetCancelledInBatches(page, 2);

     do 
    {
      foreach (var subscription in expireds)
      {
        await _couchDb.RemoveUserFromMembers(subscription.User.Email);
        page += 1;
      }
    }
    while (expireds.Count > 0);
  }
}
