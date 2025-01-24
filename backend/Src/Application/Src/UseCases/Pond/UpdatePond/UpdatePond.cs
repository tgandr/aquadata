using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Pond.UpdatePond;

public class UpdatePond : IApplicationHandler<UpdatePondInput,PondOutput>
{
  private readonly IPondRepository _repository;
  private readonly IUnitOfWork _unitOfWork;

  public UpdatePond(IPondRepository repository, IUnitOfWork unitOfWork)
  {
    _repository = repository;
    _unitOfWork = unitOfWork;
  }
  public async Task<Result<PondOutput>> Handle(UpdatePondInput request, CancellationToken cancellationToken)
  {
    var pond = await _repository.Get(request.Id, cancellationToken);

    if (pond == null || !pond.IsActive) {
      return Result<PondOutput>.Fail(
        Error.NotFound(
          "Pond.UseCases.UpdatePond",
          "Pond not found'"
        )
      ); 
    }
    
    pond.Update(request.Name, request.Area);

    await _repository.Update(pond, cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    return Result<PondOutput>.Ok(
      PondOutput.FromEntity(pond)
    );
  }
}
