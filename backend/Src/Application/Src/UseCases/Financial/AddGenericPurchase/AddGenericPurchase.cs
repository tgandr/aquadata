using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Financial.AddGenericPurchase;

public class AddGenericPurchase : IUseCaseHandler<GenericPurchaseDto, Unit>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly IFinancialRepository _financialRepository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddGenericPurchase(IUnitOfWork unitOfWork, 
  IFinancialRepository financialRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
      _unitOfWork = unitOfWork;
      _financialRepository = financialRepository;
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

    var userId = _authenticatedUserService.GetUserId();
    var financialId = await _financialRepository.GetIdByUser(userId);

    if (financialId == default)
        return Result<Unit>.Fail(
          Error.NotFound(
            "UseCases.Financial.AddGenericPurchase",
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
