using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using MediatR;

namespace Aquadata.Application.UseCases.Pond.UpdatePond;

public class UpdatePondInput: IApplicationRequest<PondOutput>
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
