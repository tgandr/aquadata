using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.UseCases.Pond.CreatePond;

public class CreatePond: IRequestHandler<CreatePondInput, Result<PondOutput, Exception>>
{
  private readonly IPondRepository _repository;
  private readonly IUnitOfWork _unitOfWork;

  public CreatePond(IPondRepository repository, IUnitOfWork unitOfWork)
  {
    _repository = repository;
    _unitOfWork = unitOfWork;
  }

  public async Task<Result<PondOutput, Exception>> Handle(CreatePondInput request, 
  CancellationToken cancellationToken)
  {
    var pondResult = PondEntity.Of(
      request.Name,
      request.Area,
      true
    );

    if (pondResult.IsFail) {
      return Result<PondOutput, Exception>.Fail(pondResult.Error!);
    }

    var pond = pondResult.Unwrap();
    pond.UserId = request.UserId;
    
    await _repository.Insert(pond, cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    return Result<PondOutput,Exception>.Ok(
      PondOutput.FromEntity(pond)
    );
  }
}