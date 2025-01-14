using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using MediatR;

namespace Aquadata.Application.UseCases.Pond.UpdatePond;

public class UpdatePondInput: IApplicationRequest<PondOutput>
{
  public Guid Id {get;}
  public string Name {get;}
  public float Area {get;}
  public Guid UserId {get;}
  
  public UpdatePondInput(Guid id, string name, float area, Guid userId)
  {
    Id = id;
    Name = name;
    Area = area;
    UserId = userId;
  }
}
