using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using MediatR;

namespace Aquadata.Application.UseCases.Pond.DeactivatePond;

public class DeactivatePondInput: IUseCaseRequest<PondOutput>
{
  public Guid Id {get;}
  public Guid UserId {get;}

  public DeactivatePondInput(Guid id, Guid userId)
  {
    Id = id;
    UserId = userId;
  }
}
