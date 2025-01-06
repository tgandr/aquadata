using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using MediatR;

namespace Aquadata.Application.UseCases.Pond.DeactivatePond;

public class DeactivatePondInput: IApplicationRequest<PondOutput>
{
  public Guid Id {get;}

  public DeactivatePondInput(Guid id)
  {
    Id = id;
  }
}
