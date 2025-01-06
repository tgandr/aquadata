using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.UseCases.User.DeleteUser;

public class DeleteUserInput : IRequest<Result<Unit,Exception>>
{
  public Guid Id { get; }

  public DeleteUserInput(Guid id)
  {
      Id = id;
  }
}
