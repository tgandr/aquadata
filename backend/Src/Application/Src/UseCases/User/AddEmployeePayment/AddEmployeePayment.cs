using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.EmployeePayment;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.User.AddEmployeePayment;

public class AddEmployeePayment: IUseCaseHandler<AddEmployeePaymentInput, Unit>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly IUserRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddEmployeePayment(IUnitOfWork unitOfWork, 
  IUserRepository cultivationRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
    _unitOfWork = unitOfWork;
    _repository = cultivationRepository;
    _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<Unit>> Handle(AddEmployeePaymentInput request, CancellationToken cancellationToken)
  {
    var paymentResult = EmployeePaymentEntity.Of(
      request.Date,
      request.Value
    );

    if (paymentResult.IsFail)
      return Result<Unit>.Fail(paymentResult.Error);

    var userId = _authenticatedUserService.GetUserId();
    var employeeExists = await _repository.EmployeeExists(request.EmployeeId, userId);

    if (!employeeExists)
      return Result<Unit>.Fail(
        Error.NotFound(
          "UseCases.User.AddEmployeePayment",
          "Employee not found"
        )
      );

    var payment = paymentResult.Unwrap();
    payment.EmployeeId = request.EmployeeId;
    payment.UserId = userId;

    await _repository.AddEmployeePayment(payment);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);
  }
}
