using Aquadata.Application.Errors;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.UseCases.Pond.GetPond;

public class GetPond: IRequestHandler<GetPondInput, Result<PondOutput, Exception>>
{
  private readonly IPondRepository _repository;
  public GetPond(IPondRepository repository)
  {
    _repository = repository;
  }

  public async Task<Result<PondOutput, Exception>> Handle(GetPondInput request, 
  CancellationToken cancellationToken)
  {
    var pondResult =  await _repository.Get(request.Id, cancellationToken);

    if (pondResult == null || !pondResult.IsActive)
    {
      return Result<PondOutput, Exception>.Fail(
        new EntityNotFoundException()
      );
    }
    return Result<PondOutput, Exception>.Ok(
      PondOutput.FromEntity(pondResult)
    );
  }
}
