using System.Collections.ObjectModel;
using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;

namespace Aquadata.Application.UseCases.User.GetInventories;

public class GetInventories : IUseCaseHandler<GetInventoriesInput, ICollection<InventoryDto>>
{
  private readonly IUserRepository _userRepository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public GetInventories(IUserRepository userRepository, 
  IAuthenticatedUserService authenticatedUserService)
  {
    _userRepository = userRepository;
    _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<ICollection<InventoryDto>>> Handle(GetInventoriesInput request, CancellationToken cancellationToken)
  {
    var userId = _authenticatedUserService.GetUserId();
    var inventories = await _userRepository.GetInventories(userId);
    var inventoriesDtos = inventories
      .Select(InventoryDto.FromEntity).ToList();
    
    return Result<ICollection<InventoryDto>>.Ok(
      inventoriesDtos
    );
  }
}
