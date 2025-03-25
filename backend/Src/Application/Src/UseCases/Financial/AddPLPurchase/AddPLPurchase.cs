using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Financial.AddPLPurchase;

public class AddPLPurchase: IUseCaseHandler<AddPLPurchaseInput, Unit>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly IFinancialRepository _financialRepository;
  private readonly ICultivationRepository _cultivationRepository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddPLPurchase(IUnitOfWork unitOfWork, 
  IFinancialRepository financialRepository,
  ICultivationRepository cultivationRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
      _unitOfWork = unitOfWork;
      _financialRepository = financialRepository;
      _authenticatedUserService = authenticatedUserService;
      _cultivationRepository = cultivationRepository;
  }

  public async Task<Result<Unit>> Handle(AddPLPurchaseInput request, 
  CancellationToken cancellationToken)
  {
    var purchaseResult = PostLarvaePurchaseEntity.Of(
      request.Date,
      request.Label,
      request.Quantity,
      request.Value
    );

    if (purchaseResult.IsFail)
      return Result<Unit>.Fail(purchaseResult.Error);

    var userId = _authenticatedUserService.GetUserId();
    var financialId = await _financialRepository.GetIdByUser(userId);

    if (financialId == default)
        return Result<Unit>.Fail(
          Error.NotFound(
            "UseCases.Financial.AddPLPurchase",
            "Financial not Found"
          )
      );
    
    var cultivationExists = await _cultivationRepository.Exists(userId, request.CultivationId);
    
    if (!cultivationExists)
      return Result<Unit>.Fail(
        Error.NotFound(
          "UseCases.Financial.AddPLPurchase",
          "Cultivation not Found"
        )
      );

    var purchase = purchaseResult.Unwrap();
    purchase.FinancialId = financialId;
    purchase.CultivationId = request.CultivationId;

    await _financialRepository.Add(purchase);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);
  }
}
