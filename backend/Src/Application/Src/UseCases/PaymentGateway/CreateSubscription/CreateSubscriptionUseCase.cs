using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Subscription;
using Aquadata.Core.Enums;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.PaymentGateway.CreateSubscription;

public class CreateSubscriptionUseCase: 
IUseCaseHandler<CreateSubscriptionInput, SubscriptionOutput>
{
  private readonly ISubscriptionRepository _subscriptionRepository;
  private readonly IPaymentGateway _paymentGateway;
  private readonly IAuthenticatedUserService _authenticatedUser;

  public CreateSubscriptionUseCase(
    ISubscriptionRepository subscriptionRepository, 
    IPaymentGateway paymentGateway,
    IAuthenticatedUserService authenticatedUser
  )
  {
    _authenticatedUser = authenticatedUser;
    _paymentGateway = paymentGateway;
    _subscriptionRepository = subscriptionRepository;
  }

  public async Task<Result<SubscriptionOutput>> Handle(CreateSubscriptionInput request, CancellationToken cancellationToken)
  {
    var userId = _authenticatedUser.GetUserId();
    var subscriptionFromDb = await _subscriptionRepository.GetByUserId(userId);

    if (subscriptionFromDb != null &&
      subscriptionFromDb.Status == SubscriptionStatus.Active)
    {
      return Result<SubscriptionOutput>.Fail(
        Error.Conflict(
          "Subscription",
          "User already has an active subscription"
        )
      );
    }
    
    var subscriptionResult = await _paymentGateway.CreateSubscription(request);

    if (subscriptionResult.IsFail)
      return Result<SubscriptionOutput>.Fail(subscriptionResult.Error);

    var subscription = subscriptionResult.Unwrap();

    await _subscriptionRepository.Create(new SubscriptionEntity(
      subscription.Id,
      userId,
      SubscriptionStatus.Pending
    ));

    return Result<SubscriptionOutput>.Ok(subscription);
  }
}
