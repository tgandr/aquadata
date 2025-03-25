using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Employee;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Financial.AddEmployee;

public class AddEmployee : IUseCaseHandler<EmployeeDto, Unit>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly IFinancialRepository _financialRepository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddEmployee(IUnitOfWork unitOfWork, 
  IFinancialRepository financialRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
      _unitOfWork = unitOfWork;
      _financialRepository = financialRepository;
      _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<Unit>> Handle(EmployeeDto request, CancellationToken cancellationToken)
  {
    var employeeResult = EmployeeEntity.Of(
      request.Name 
    );

    if (employeeResult.IsFail)
      return Result<Unit>.Fail(employeeResult.Error);

    var userId = _authenticatedUserService.GetUserId();
    var financialId = await _financialRepository.GetIdByUser(userId);

    if (financialId == default)
        return Result<Unit>.Fail(
          Error.NotFound(
            "UseCases.Financial.AddEmployee",
            "Financial not Found"
          )
      );
      
    var employee = employeeResult.Unwrap();
    employee.FinancialId = financialId;

    await _financialRepository.Add(employee);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);
  }
}
