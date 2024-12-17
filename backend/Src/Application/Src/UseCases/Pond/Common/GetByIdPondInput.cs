using Aquadata.Application.Interfaces;

namespace Aquadata.Application.UseCases.Pond.Common;

public class GetPondByIdInput: IApplicationRequest<PondOutput>
{
  public Guid Id {get;}
  public GetPondByIdInput(Guid id)
  {
    Id = id;
  }
}
