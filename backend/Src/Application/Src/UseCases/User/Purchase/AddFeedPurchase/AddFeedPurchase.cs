using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.User.Purchase.AddFeedPurchase;

public class AddFeedPurchase : IUseCaseHandler<AddFeedPurchaseInput, FeedPurchaseDto>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly IUserRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddFeedPurchase(IUnitOfWork unitOfWork, 
  IUserRepository cultivationRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
      _unitOfWork = unitOfWork;
      _repository = cultivationRepository;
      _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<FeedPurchaseDto>> Handle(AddFeedPurchaseInput request, 
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
      return Result<FeedPurchaseDto>.Fail(purchaseResult.Error);

    var userId = _authenticatedUserService.GetUserId();
    
    var purchase = purchaseResult.Unwrap();
    purchase.UserId = userId;

    await _repository.AddFeedPurchase(purchase);
    await _unitOfWork.Commit(cancellationToken);

    return Result<FeedPurchaseDto>.Ok(
      FeedPurchaseDto.FromEntity(purchase)
    );
  }
}
