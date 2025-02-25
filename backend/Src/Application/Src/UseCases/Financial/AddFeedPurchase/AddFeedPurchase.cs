using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Financial.AddFeedPurchase;

public class AddFeedPurchase : IUseCaseHandler<AddFeedPurchaseInput, Unit>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly IFinancialRepository _financialRepository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddFeedPurchase(IUnitOfWork unitOfWork, 
  IFinancialRepository financialRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
      _unitOfWork = unitOfWork;
      _financialRepository = financialRepository;
      _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<Unit>> Handle(AddFeedPurchaseInput request, 
  CancellationToken cancellationToken)
  {
    var purchaseResult = FeedPurchaseEntity.Of(
      request.Date,
      request.Label,
      request.Brand,
      request.Quantity,
      request.Value,
      request.Validity,
      request.BagSize,
      request.RationType
    );

    if (purchaseResult.IsFail)
      return Result<Unit>.Fail(purchaseResult.Error);

    var userId = _authenticatedUserService.GetUserId();
    var financialId = await _financialRepository.GetIdByUser(userId);

    if (financialId == default)
        return Result<Unit>.Fail(
          Error.NotFound(
            "UseCases.Financial.AddFeedPurchase",
            "Financial not Found"
          )
      );

    var purchase = purchaseResult.Unwrap();
    purchase.FinancialId = financialId;

    await _financialRepository.Add(purchase);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(
      Unit.Value
    );
  }
}
