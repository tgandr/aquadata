using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;

namespace Aquadata.Application.UseCases.Pond.GetPondsByUser;

public class GetPondsByUser : IUseCaseHandler<GetPondsByUserInput, ICollection<PondOutput>>
{
  private readonly IPondRepository _pondRepository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public GetPondsByUser(IPondRepository pondRepository, IAuthenticatedUserService authenticatedUserService)
  {
    _pondRepository = pondRepository;
    _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<ICollection<PondOutput>>> Handle(GetPondsByUserInput request, 
  CancellationToken cancellationToken)
  {
    var userId = _authenticatedUserService.GetUserId();
    var ponds = await _pondRepository.GetPondsByUser(userId, cancellationToken);
    var pondsDtos = ponds.Select(PondOutput.FromEntity).ToList();

    return Result<ICollection<PondOutput>>.Ok(pondsDtos);
  }
}
