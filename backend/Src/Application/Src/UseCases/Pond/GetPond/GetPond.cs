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
  public GetPond(IPondRepository repository)
  {
    _repository = repository;
  }

  public async Task<Result<PondOutput>> Handle(GetPondInput request, 
  CancellationToken cancellationToken)
  {
    var pondResult =  await _repository.Get(request.Id, cancellationToken);

    if (pondResult == null || !pondResult.IsActive)
    {
      return Result<PondOutput>.Fail(
        Error.NotFound(
          "UseCases.Pond.GetPond",
          "Pond not found'"
        )
      );
    }
    return Result<PondOutput>.Ok(
      PondOutput.FromEntity(pondResult)
    );
  }
}
