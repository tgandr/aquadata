using Aquadata.Application.Interfaces;
using Aquadata.Core.Enums;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.Payment;

public class CreatePayment<TRequest, TResponse>
{
  private readonly IPaymentService<TRequest, TResponse> _paymentService;
  private readonly IAuthenticatedUserService _authenticatedUserService;
  private readonly IUserRepository _userRepository;
  
  public CreatePayment(
    IPaymentService<TRequest, TResponse> paymentService,
    IUserRepository userRepository,
    IAuthenticatedUserService authenticatedUserService)
  {
    _userRepository = userRepository;
    _authenticatedUserService = authenticatedUserService;
    _paymentService = paymentService;
  }

  public async Task<Result<TResponse>> ExecuteAsync(TRequest command)
  {
    var authenticatedUserId = _authenticatedUserService.GetUserId();
    var userExists = await _userRepository.Exists(authenticatedUserId);

    if (!userExists)
      return Result<TResponse>.Fail(
        Error.NotFound(
          "UseCases.Payment.CreatePayment",
          "User not found"
        )
      );

    var createPaymentResponse = await _paymentService.CreatePaymentAsync(command);
    var paymentEntity = _paymentService.ToPaymentEntity(createPaymentResponse, authenticatedUserId);

    if (paymentEntity.Status == PaymentStatus.REJECTED)
      return Result<TResponse>.Fail(
        Error.Validation(
          "UseCases.Payment.CreatePayment",
          "Payment rejected"
        )
    );

    return Result<TResponse>.Ok(createPaymentResponse);
  }
}
