using Aquadata.Application.Interfaces;
using Aquadata.Core.Enums;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.PaymentGateway.CancelSubscription;

public class CancelSubscriptionUseCase : IUseCaseHandler<CancelSubscriptionInput, Unit>
{
  private readonly ISubscriptionRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUser;
  private readonly IPaymentGateway _paymentGateway;

  public CancelSubscriptionUseCase(
    ISubscriptionRepository repository,
    IPaymentGateway paymentGateway,
    IAuthenticatedUserService authenticatedUser)
  {
    _repository = repository;
    _authenticatedUser = authenticatedUser;
    _paymentGateway = paymentGateway;
  }

  public async Task<Result<Unit>> Handle(CancelSubscriptionInput request, CancellationToken cancellationToken)
  {
    var userId = _authenticatedUser.GetUserId();
    var entity = await _repository.GetByUserId(userId);

    if (entity == null)
      return Result<Unit>.Fail(
        Error.NotFound(
          "UseCases.PaymentGateway.CancelSubscription",
          "Subscription not found"
      ));
    if (entity.Status != SubscriptionStatus.Active)
      return Result<Unit>.Fail(
        Error.Conflict(
          "UseCases.PaymentGateway.CancelSubscription",
          "Subscription is not active"
        )
      );

    var cancelResult = await _paymentGateway.CancelSubscription(entity.SubscriptionId);
    if (cancelResult.IsFail)
      return Result<Unit>.Fail(
        Error.Validation(
          "UseCases.PaymentGateway.CancelSubscription",
          "Failed to cancel subscription"
        )
      );

    await _repository.Cancel(entity.SubscriptionId);
    return Result<Unit>.Ok(Unit.Value);
  }
}
