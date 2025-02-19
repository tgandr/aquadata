using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;

namespace Aquadata.Application.UseCases.Pond.GetPond;

public class GetPondInput: IUseCaseRequest<PondOutput>
{
  public Guid Id {get;}

  public GetPondInput(Guid id)
  {
    Id = id;
  }
}
