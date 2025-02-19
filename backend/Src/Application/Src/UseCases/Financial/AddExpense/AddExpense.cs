using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Expense;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Financial.AddExpense;

public class AddExpense: IUseCaseHandler<ExpenseDto, Unit>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly IUserRepository _repository;
  private readonly IPondRepository _pondRepository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddExpense(IUnitOfWork unitOfWork, 
  IUserRepository cultivationRepository,
  IPondRepository pondRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
    _unitOfWork = unitOfWork;
    _repository = cultivationRepository;
    _authenticatedUserService = authenticatedUserService;
    _pondRepository = pondRepository;
  }

  public async Task<Result<Unit>> Handle(ExpenseDto request, CancellationToken cancellationToken)
  {
    var expenseResult = ExpenseEntity.Of(
      request.Date,
      request.Description
    );

    if (expenseResult.IsFail)
      return Result<Unit>.Fail(expenseResult.Error);

    var userId = _authenticatedUserService.GetUserId();
    var expense = expenseResult.Unwrap();
  
    var pondIds = request.CostsPerPonds.Select(c => c.PondId)
      .ToHashSet();

    foreach (var id in pondIds)
    {
      var pondExists = await _pondRepository.Exists(userId, id);

      if (!pondExists)
        return Result<Unit>.Fail(
          Error.NotFound(
            "UseCases.Financial.AddExpense",
            "Pond not Found"
          )
      );
    }
  
    expense.UserId = userId;
    expense.CostsPerPond = request.CostsPerPonds.Select(c =>
      c.ToEntity(expense.Id)
    ).ToList();

    await _repository.AddExpense(expense);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);
  }
}
