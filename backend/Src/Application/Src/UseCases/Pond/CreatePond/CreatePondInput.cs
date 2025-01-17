using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;

namespace Aquadata.Application.UseCases.Pond.CreatePond;

public class CreatePondInput: IApplicationRequest<PondOutput>
{
  public string Name {get;}
  public float Area {get;}
  public Guid UserId {get;}

  public CreatePondInput(string name, float area, Guid userId)
  {
      Name = name;
      Area = area;
      UserId = userId;
  }


}
