using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;

namespace Aquadata.Application.UseCases.User.GetStocks;

public class GetStocks: IUseCaseHandler<GetStocksInput, ICollection<StockDto>>
{
  private readonly IUserRepository _userRepository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public GetStocks(IUserRepository userRepository, 
  IAuthenticatedUserService authenticatedUserService)
  {
    _userRepository = userRepository;
    _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<ICollection<StockDto>>> Handle(GetStocksInput request, CancellationToken cancellationToken)
  {
    var userId = _authenticatedUserService.GetUserId();
    var stocks = await _userRepository.GetStocks(userId);

    var stocksDtos = stocks
      .Select(StockDto.FromEntity).ToList();

    return Result<ICollection<StockDto>>.Ok(
      stocksDtos
    );
  }
}
