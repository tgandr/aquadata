using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Pond.CreatePond;

public class CreatePond: IUseCaseHandler<CreatePondInput, PondOutput>
{
  private readonly IPondRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;
  private readonly IUnitOfWork _unitOfWork;

  public CreatePond(IPondRepository repository, 
  IUnitOfWork unitOfWork, IAuthenticatedUserService authenticatedUserService)
  {
    _repository = repository;
    _unitOfWork = unitOfWork;
    _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<PondOutput>> Handle(CreatePondInput request, 
  CancellationToken cancellationToken)
  {
    var pondResult = PondEntity.Of(
      request.Name,
      request.Area,
      true
    );

    if (pondResult.IsFail) {
      return Result<PondOutput>.Fail(pondResult.Error!);
    }
    
    var userId = _authenticatedUserService.GetUserId();
    var pond = pondResult.Unwrap();

    if (userId != request.UserId.ToString())
      return Result<PondOutput>.Fail(
        Error.Unauthorized(
          "UseCases.Pond.Create",
          "Unauthorized"
    ));

    pond.UserId = request.UserId;
    
    await _repository.Insert(pond, cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    return Result<PondOutput>.Ok(
      PondOutput.FromEntity(pond)
    );
  }
}
