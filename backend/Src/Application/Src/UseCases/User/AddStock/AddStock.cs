using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Stock;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.UseCases.User.AddStock;

public class AddStock: IUseCaseHandler<StockDto, Unit>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly IUserRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddStock(IUnitOfWork unitOfWork, 
  IUserRepository cultivationRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
    _unitOfWork = unitOfWork;
    _repository = cultivationRepository;
    _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<Unit>> Handle(StockDto request, CancellationToken cancellationToken)
  {
    var stockResult = StockEntity.Of(
      request.Label,
      request.Type,
      request.Quantity
    );

    if (stockResult.IsFail)
      return Result<Unit>.Fail(stockResult.Error);

    var userId = _authenticatedUserService.GetUserId();
    var stock = stockResult.Unwrap();
    stock.UserId = userId;

    await _repository.AddStock(stock);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);
  }
}
