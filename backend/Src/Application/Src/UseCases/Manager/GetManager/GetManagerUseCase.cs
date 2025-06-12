using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Manager.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.Manager.GetManager;

public class GetManagerUseCase : IUseCaseHandler<GetManagerInput, ManagerOutput>
{
  private readonly IManagerRepository _repository;
  private readonly IAuthenticatedUserService _authUser;

  public GetManagerUseCase(
    IManagerRepository repository,
    IAuthenticatedUserService authUser
  )
  {
    _authUser = authUser;
    _repository = repository;
  }

  public async Task<Result<ManagerOutput>> Handle(GetManagerInput request, CancellationToken cancellationToken)
  {
    var result = await _repository.GetByPhone(request.Phone);
    var authUserId = _authUser.GetUserId();
    if (result is null)
      return Result<ManagerOutput>.Fail(
        Error.NotFound(
          "UseCases.Managers.GetManager",
          "Manager not found"
        )
    );

    if (result.ProducerId != authUserId)
      return Result<ManagerOutput>.Fail(
        Error.Unauthorized(
          "UseCases.Managers.GetManager",
          "You don't have permission to access this data"
        )
      );
    
    return Result<ManagerOutput>.Ok(
      ManagerOutput.FromEntity(result)
    );
  }
}
