using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Payment;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;

namespace Aquadata.Application.UseCases.Payment.Create;

public class CreatePayment: IUseCaseHandler<CreatePaymentInput, PaymentOutput>
{
  private readonly IPaymentRepository _paymentRepository;
  private readonly IAuthenticatedUserService _authenticatedUser;
  private readonly IPaymentGateway _paymentGateway;

  public CreatePayment(
    IPaymentRepository paymentRepository, 
    IAuthenticatedUserService authenticatedUser,
    IPaymentGateway paymentGateway
  )
  {
    _paymentGateway = paymentGateway;
    _paymentRepository = paymentRepository;
    _authenticatedUser = authenticatedUser;
  }

  public async Task<Result<PaymentOutput>> Handle(CreatePaymentInput request, CancellationToken cancellationToken)
  {
    var authenticatedUserId = _authenticatedUser.GetUserId();
    var createCustomerResult = await _paymentGateway.SaveCustomerAndCardIfNotExists(
      request.Payer.Email,
      request.Payer.Identification.Type,
      request.Payer.Identification.Number,
      request.Token
    );

    if (createCustomerResult.IsFail)
      return Result<PaymentOutput>.Fail(createCustomerResult.Error);

    var (customerId, cardId) = createCustomerResult.Unwrap();
    var paymentResult = await _paymentGateway.CreatePaymentAsync(request);

    if (paymentResult.IsFail)
      return Result<PaymentOutput>.Fail(paymentResult.Error);

    var payment = paymentResult.Unwrap();
    var paymentEntity = new PaymentEntity(
      payment.Id,
      customerId,
      cardId,
      request.Payer.Email,
      request.Payer.Identification.Type,
      request.Payer.Identification.Number,
      authenticatedUserId
    );

    await _paymentRepository.CreateOrUpdate(paymentEntity);
    return Result<PaymentOutput>.Ok(payment);
  }
}
