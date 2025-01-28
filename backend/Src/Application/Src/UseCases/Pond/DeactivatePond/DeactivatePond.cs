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
  private readonly IUnitOfWork _unitOfWork;

  public DeactivatePond(IPondRepository repository, IUnitOfWork unitOfWork)
  {
    _repository = repository;
    _unitOfWork = unitOfWork;
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
    
    if (pond.UserId != request.UserId)
      return Result<PondOutput>.Fail(
        Error.Unauthorized(
          "UseCases.Pond.DeactivatePond",
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
