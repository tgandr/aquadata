using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.User.Purchase.AddGenericPurchase;

public class AddGenericPurchase : IUseCaseHandler<GenericPurchaseDto, Unit>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly IUserRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddGenericPurchase(IUnitOfWork unitOfWork, 
  IUserRepository cultivationRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
      _unitOfWork = unitOfWork;
      _repository = cultivationRepository;
      _authenticatedUserService = authenticatedUserService;
  }
  
  public async Task<Result<Unit>> Handle(GenericPurchaseDto request, CancellationToken cancellationToken)
  {
    var purchaseResult = GenericPurchaseEntity.Of(
      request.Date,
      request.Label,
      request.Quantity,
      request.Value,
      request.Description
    );

    if (purchaseResult.IsFail)
      return Result<Unit>.Fail(purchaseResult.Error);

    var userId = _authenticatedUserService.GetUserId() ?? "";
    Guid parsedId;

    if (!Guid.TryParse(userId, out parsedId))
      return Result<Unit>.Fail(
        Error.Validation(
          "UseCases.Users.AddFeedPurchase",
          "Invalid Id Format"
      )
    );

    var purchase = purchaseResult.Unwrap();
    purchase.UserId = parsedId;

    await _repository.AddGenericPurchase(purchase);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);
  }
}
