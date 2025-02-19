using Aquadata.Application.Interfaces;
using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.UseCases.User.DeleteUser;

public class DeleteUserInput : IUseCaseRequest<Unit>
{
  public Guid Id { get; }

  public DeleteUserInput(Guid id)
  {
      Id = id;
  }
}
