using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.Dtos;
public class AddFertilizerPurchase : IUseCaseHandler<FertilizerPurchaseDto, Unit>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly IFinancialRepository _financialRepository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddFertilizerPurchase(IUnitOfWork unitOfWork, 
  IFinancialRepository financialRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
      _unitOfWork = unitOfWork;
      _financialRepository = financialRepository;
      _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<Unit>> Handle(FertilizerPurchaseDto request, 
  CancellationToken cancellationToken)
  {
    var purchaseResult = FertilizerPurchaseEntity.Of(
      request.Date,
      request.Label,
      request.Quantity,
      request.Value,
      request.Unit
    );

    if (purchaseResult.IsFail)
      return Result<Unit>.Fail(purchaseResult.Error);

    var userId = _authenticatedUserService.GetUserId();
    var financialId = await _financialRepository.GetIdByUser(userId);

    if (financialId == default)
        return Result<Unit>.Fail(
          Error.NotFound(
            "UseCases.Financial.AddFertilizerPurchase",
            "Financial not Found"
          )
      );

    var purchase = purchaseResult.Unwrap();
    purchase.FinancialId = financialId;

    await _financialRepository.Add(purchase);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);
  }
}

