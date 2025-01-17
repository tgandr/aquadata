using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.User.Common;
using MediatR;

namespace Aquadata.Application.UseCases.User.GetUser;

public class GetUserInput: IApplicationRequest<UserOutput>
{
  public Guid Id { get; }
  public GetUserInput(Guid id)
  {
    Id = id;
  }

}
