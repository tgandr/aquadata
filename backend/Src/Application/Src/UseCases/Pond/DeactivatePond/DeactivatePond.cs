using Aquadata.Application.Errors;
using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.UseCases.Pond.DeactivatePond;

public class DeactivatePond: IRequestHandler<GetPondByIdInput, Result<PondOutput, Exception>>
{
  private readonly IPondRepository _repository;
  private readonly IUnitOfWork _unitOfWork;

  public DeactivatePond(IPondRepository repository, IUnitOfWork unitOfWork)
  {
    _repository = repository;
    _unitOfWork = unitOfWork;
  }

  public async Task<Result<PondOutput, Exception>> Handle(GetPondByIdInput request, CancellationToken cancellationToken)
  {
    var pond = await _repository.Get(request.Id, cancellationToken);
    
    if (pond == null || !pond.IsActive) {
      return Result<PondOutput, Exception>.Fail(
        new EntityNotFoundException()
      );
    }
    
    await _repository.Deactivate(pond, cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    return Result<PondOutput, Exception>.Ok(
      PondOutput.FromEntity(pond)
    );
  }
}
