using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.User.Purchase.AddPLPurchase;

public class AddPLPurchase: IUseCaseHandler<AddPLPurchaseInput, Unit>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly IUserRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddPLPurchase(IUnitOfWork unitOfWork, 
  IUserRepository cultivationRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
      _unitOfWork = unitOfWork;
      _repository = cultivationRepository;
      _authenticatedUserService = authenticatedUserService;
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

    var purchase = purchaseResult.Unwrap();
    purchase.UserId = userId;
    purchase.CultivationId = request.CultivationId;

    await _repository.AddPLPurchase(purchase);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);
  }
}
