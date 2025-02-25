using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Inventory;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.UseCases.User.AddInventory;

public class AddInventory: IUseCaseHandler<InventoryDto, Unit>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly IUserRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddInventory(IUnitOfWork unitOfWork, 
  IUserRepository userRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
    _unitOfWork = unitOfWork;
    _repository = userRepository;
    _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<Unit>> Handle(InventoryDto request, CancellationToken cancellationToken)
  {
    var inventoryResult = InventoryEntity.Of(
      request.ItemName,
      request.AmountInvested,
      request.FinalValue,
      request.UsefulLifeInYears,
      request.Status,
      request.InOperationSince.ToString()
    );

    if (inventoryResult.IsFail)
      return Result<Unit>.Fail(inventoryResult.Error);
    
    var userId = _authenticatedUserService.GetUserId();
    var inventory = inventoryResult.Unwrap();

    inventory.UserId = userId;

    await _repository.AddInventory(inventory);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);
  }
}
