using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;

namespace Aquadata.Application.UseCases.Pond.UpdatePond;

public class UpdatePondInput: IUseCaseRequest<PondOutput>
{
  public Guid Id {get;}
  public string Name {get;}
  public float Area {get;}
  
  public UpdatePondInput(Guid id, string name, float area)
  {
    Id = id;
    Name = name;
    Area = area;
  }
}
