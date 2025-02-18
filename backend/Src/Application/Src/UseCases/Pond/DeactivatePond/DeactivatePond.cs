using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Pond.DeactivatePond;

public class DeactivatePond: IUseCaseHandler<DeactivatePondInput, PondOutput>
{
  private readonly IPondRepository _repository;
  private readonly IAuthenticatedUserService _authenticateUserService;
  private readonly IUnitOfWork _unitOfWork;

  public DeactivatePond(IPondRepository repository, 
  IUnitOfWork unitOfWork, IAuthenticatedUserService authenticatedUserService)
  {
    _repository = repository;
    _unitOfWork = unitOfWork;
    _authenticateUserService = authenticatedUserService;
  }

  public async Task<Result<PondOutput>> Handle(DeactivatePondInput request, 
  CancellationToken cancellationToken)
  {
    var pond = await _repository.Get(request.Id, cancellationToken);

    if (pond == null || !pond.IsActive) {
      return Result<PondOutput>.Fail(
        Error.NotFound(
          "UseCases.Pond.DeactivatePond",
          "Pond not found'"
        )
      );
    }

    var userId = _authenticateUserService.GetUserId();

    if (pond.UserId != userId)
      return Result<PondOutput>.Fail(
        Error.Unauthorized(
          "UseCases.Pond.Deactivate",
          "Unauthorized"
        )
    );
    
    await _repository.Deactivate(pond, cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    return Result<PondOutput>.Ok(
      PondOutput.FromEntity(pond)
    );
  }
}
