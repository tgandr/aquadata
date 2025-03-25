using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.EmployeePayment;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Financial.AddEmployeePayment;

public class AddEmployeePayment: IUseCaseHandler<AddEmployeePaymentInput, Unit>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly IFinancialRepository _financialRepository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddEmployeePayment(IUnitOfWork unitOfWork, 
  IFinancialRepository financialRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
    _unitOfWork = unitOfWork;
    _financialRepository = financialRepository;
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
    var employeeExists = await _financialRepository.EmployeeExists(request.EmployeeId, userId);
    var financialId = await _financialRepository.GetIdByUser(userId);

    if (!employeeExists)
      return Result<Unit>.Fail(
        Error.NotFound(
          "UseCases.User.AddEmployeePayment",
          "Employee not found"
        )
      );
      
    if (financialId == default)
      return Result<Unit>.Fail(
        Error.NotFound(
          "UseCases.User.AddEmployeePayment",
          "Financial not found"
        )
      );

    var payment = paymentResult.Unwrap();
    payment.EmployeeId = request.EmployeeId;
    payment.FinancialId = financialId;

    await _financialRepository.Add(payment);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);
  }
}
