using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Pond.UpdatePond;

public class UpdatePond : IUseCaseHandler<UpdatePondInput,PondOutput>
{
  private readonly IPondRepository _repository;
  private readonly IAuthenticatedUserService _authenticateUserService;
  private readonly IUnitOfWork _unitOfWork;

  public UpdatePond(IPondRepository repository, 
  IUnitOfWork unitOfWork, IAuthenticatedUserService authenticatedUserService)
  {
    _repository = repository;
    _unitOfWork = unitOfWork;
    _authenticateUserService = authenticatedUserService;
  }

  public async Task<Result<PondOutput>> Handle(UpdatePondInput request, CancellationToken cancellationToken)
  {
    var pond = await _repository.Get(request.Id, cancellationToken);

    if (pond == null || !pond.IsActive) {
      return Result<PondOutput>.Fail(
        Error.NotFound(
          "UseCases.Pond.UpdatePond",
          "Pond not found'"
        )
      ); 
    }
    
    var userId = _authenticateUserService.GetUserId() ?? "";

    if (pond.UserId.ToString() != userId)
      return Result<PondOutput>.Fail(
        Error.Unauthorized(
          "UseCases.Pond.UpdatePond",
          "Unauthorized"
        )
    );

    pond.Update(request.Name, request.Area);

    await _repository.Update(pond, cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    return Result<PondOutput>.Ok(
      PondOutput.FromEntity(pond)
    );
  }
}
