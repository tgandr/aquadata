using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using MediatR;

namespace Aquadata.Application.UseCases.Pond.CreatePond;

public class CreatePondInput: IApplicationRequest<PondOutput>
{
  public string Name {get;set;}
  public float Area {get;set;}

  public CreatePondInput(string name, float area)
  {
      Name = name;
      Area = area;
  }


}
