using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.User.DeleteUser;

public class DeleteUser : IApplicationHandler<DeleteUserInput,Unit>
{
  private readonly IUserRepository _userRepository;
  private readonly IUnitOfWork _unitOfWork;

  public DeleteUser(IUserRepository userRepository, IUnitOfWork unitOfWork)
  {
    _userRepository = userRepository;
    _unitOfWork = unitOfWork;
  }

  public async Task<Result<Unit>> Handle(DeleteUserInput request, 
  CancellationToken cancellationToken)
  {
    var user = await _userRepository.Get(request.Id, cancellationToken);

    if (user == null)
      return Result<Unit>.Fail(
        Error.NotFound(
          "User.UseCases.DeleteUser",
          "User not found'"
        )
      );

    await _userRepository.Delete(user, cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    return Unit.Value;
  }
}
