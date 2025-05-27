using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Subscription;
using Aquadata.Core.Enums;
using Aquadata.Core.Interfaces.Repository;
using MediatR;

namespace Aquadata.Application.UseCases.Payment.HandleWebHook;

public class HandleHook : IRequestHandler<PaymentWebHookInput, Unit>
{
  private readonly IPaymentGateway _paymentGateway;
  private readonly ISubscriptionRepository _subscriptionRepository;
  private readonly ICouchdbService _couchDb;

  public HandleHook(
    IPaymentGateway paymentGateway, 
    ISubscriptionRepository subscriptionRepository,
    ICouchdbService couchDb)
  {
    _paymentGateway = paymentGateway;
    _subscriptionRepository = subscriptionRepository;
    _couchDb = couchDb;
  }

  public async Task<Unit> Handle(PaymentWebHookInput request, CancellationToken cancellationToken)
  {
    if (request.Type != "payment") return Unit.Value;
    
    var payment = await _paymentGateway.GetPayment(request.PaymentId);
    if (payment == null) return Unit.Value;
    
    var subscriptionFromDb = await _subscriptionRepository
      .GetById(payment.SubscriptionId);

    if (subscriptionFromDb == null) return Unit.Value;

    if (payment.Status != "approved") 
    {
      await _subscriptionRepository.Cancel(subscriptionFromDb.SubscriptionId);
      await _couchDb.RemoveUserFromMembers(subscriptionFromDb.User.Email);
      return Unit.Value;
    }

    await _couchDb.SetUserAsMember(subscriptionFromDb.User.Email);
    await _subscriptionRepository.Create(new SubscriptionEntity(
      payment.SubscriptionId,
      subscriptionFromDb.UserId
    ));    
      
    return Unit.Value;
  }
}
