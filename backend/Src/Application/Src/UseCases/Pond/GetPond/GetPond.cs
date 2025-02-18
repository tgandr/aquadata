using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Pond.GetPond;

public class GetPond: IUseCaseHandler<GetPondInput, PondOutput>
{
  private readonly IPondRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;
  public GetPond(IPondRepository repository, 
  IAuthenticatedUserService authenticatedUserService)
  {
    _repository = repository;
    _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<PondOutput>> Handle(GetPondInput request, 
  CancellationToken cancellationToken)
  {
    var pond =  await _repository.Get(request.Id, cancellationToken);
    if (pond == null || !pond.IsActive)
    {
      return Result<PondOutput>.Fail(
        Error.NotFound(
          "UseCases.Pond.GetPond",
          "Pond not found'"
        )
      );
    }

    var userId = _authenticatedUserService.GetUserId();
    if (pond.UserId != userId) 
      return Result<PondOutput>.Fail(
        Error.Unauthorized(
          "UseCases.Pond.GetPond",
          "Unauthorized"
        )
    );

    return Result<PondOutput>.Ok(
      PondOutput.FromEntity(pond)
    );
  }
}
