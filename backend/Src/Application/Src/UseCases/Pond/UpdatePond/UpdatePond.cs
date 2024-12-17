using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.UseCases.Pond.UpdatePond;

public class UpdatePond : IRequestHandler<UpdatePondInput, Result<PondOutput, Exception>>
{
  private readonly IPondRepository _repository;
  private readonly IUnitOfWork _unitOfWork;

  public UpdatePond(IPondRepository repository, IUnitOfWork unitOfWork)
  {
    _repository = repository;
    _unitOfWork = unitOfWork;
  }
  public async Task<Result<PondOutput, Exception>> Handle(UpdatePondInput request, CancellationToken cancellationToken)
  {
    var pond = await _repository.Get(request.Id, cancellationToken);
    pond.Update(request.Name, request.Area);

    await _repository.Update(pond, cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    return PondOutput.FromEntity(pond);
  }
}
