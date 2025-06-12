using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.PaymentGateway.CreateSubscription;
using Aquadata.Core.Entities.Payment;
using Aquadata.Core.Entities.Subscription;
using Aquadata.Core.Interfaces.Repository;

namespace Aquadata.Infra.Payments.MercadoPago.Jobs;

public class CancelSubscriptionsJob
{
  private readonly ISubscriptionRepository _repository;
  private readonly ICouchdbService _couchDb;
  private readonly IPaymentGateway _gateway;

  public CancelSubscriptionsJob(
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
    ICollection<SubscriptionEntity> expireds;

    do 
    {
      expireds = await _repository.GetCancelledInBatches(page, 2);
      foreach (var subscription in expireds)
      {
        if (subscription.Status == Core.Enums.SubscriptionStatus.Active)
          await _repository.Cancel(subscription.SubscriptionId);

        // await _couchDb.RemoveUserFromMembers(subscription.User.Email);
        page += 1;
      }
    }
    while (expireds.Count > 0);
  }
}
