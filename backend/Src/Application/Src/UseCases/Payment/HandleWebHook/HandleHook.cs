using Aquadata.Application.Interfaces;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Payment.HandleWebHook;

public class HandleHook : IUseCaseHandler<PaymentWebHookInput, Unit>
{
  private readonly IPaymentGateway _paymentGateway;
  private readonly IPaymentRepository _paymentRepository;
  private readonly ISubscriptionRepository _subscriptionRepository;
  private readonly ICouchdbService _couchDb;

  public HandleHook(
    IPaymentGateway paymentGateway, 
    IPaymentRepository paymentRepository,
    ISubscriptionRepository subscriptionRepository,
    ICouchdbService couchDb)
  {
    _paymentGateway = paymentGateway;
    _subscriptionRepository = subscriptionRepository;
    _paymentRepository = paymentRepository;
    _couchDb = couchDb;
  }

  public async Task<Result<Unit>> Handle(PaymentWebHookInput request, CancellationToken cancellationToken)
  {
    var payment = await _paymentGateway.GetPaymentAsync(request.PaymentId);
    var paymentFromDb = await _paymentRepository.GetByPaymentId(payment.Id.ToString()!);

    if (payment.Status != "approved") 
    {
      await _subscriptionRepository.ToExpired(paymentFromDb!.UserId);
      await _couchDb.RemoveUserFromMembers(paymentFromDb.User.Email);
      return Result<Unit>.Fail(
        Error.None
      );
    }
    
    await _couchDb.SetUserAsMember(paymentFromDb!.User.Email);
    await _subscriptionRepository.CreateOrRenew(paymentFromDb.UserId);    
      
    return Result<Unit>.Ok(Unit.Value);
  }
}
