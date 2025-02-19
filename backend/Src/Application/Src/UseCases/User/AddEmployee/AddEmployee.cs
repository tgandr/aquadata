using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Employee;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.User.AddEmployee;

public class AddEmployee : IUseCaseHandler<EmployeeDto, Unit>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly IUserRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddEmployee(IUnitOfWork unitOfWork, 
  IUserRepository cultivationRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
      _unitOfWork = unitOfWork;
      _repository = cultivationRepository;
      _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<Unit>> Handle(EmployeeDto request, CancellationToken cancellationToken)
  {
    var purchaseResult = EmployeeEntity.Of(
      request.Name 
    );

    if (purchaseResult.IsFail)
      return Result<Unit>.Fail(purchaseResult.Error);

    var userId = _authenticatedUserService.GetUserId();

    var purchase = purchaseResult.Unwrap();
    purchase.UserId = userId;

    await _repository.AddEmployee(purchase);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);
  }
}
