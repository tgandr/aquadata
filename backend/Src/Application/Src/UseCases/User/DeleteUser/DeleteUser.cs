using Aquadata.Application.Interfaces;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.User.DeleteUser;

public class DeleteUser : IUseCaseHandler<DeleteUserInput,Unit>
{
  private readonly IUserRepository _userRepository;
  private readonly IAuthenticatedUserService _authenticatedUserService;
  private readonly IUnitOfWork _unitOfWork;

  public DeleteUser(IUserRepository userRepository, 
  IUnitOfWork unitOfWork, IAuthenticatedUserService authenticatedUserService)
  {
    _userRepository = userRepository;
    _unitOfWork = unitOfWork;
    _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<Unit>> Handle(DeleteUserInput request, 
  CancellationToken cancellationToken)
  {
    var user = await _userRepository.Get(request.Id, cancellationToken);

    if (user == null)
      return Result<Unit>.Fail(
        Error.NotFound(
          "UseCases.User.DeleteUser",
          "User not found'"
        )
      );
    
    var userId = _authenticatedUserService.GetUserId();
    if (userId != user.Id.ToString())
      return Result<Unit>.Fail(
        Error.Unauthorized(
          "UseCases.Pond.Deactivate",
          "Unauthorized"
        )
    );

    await _userRepository.Delete(user, cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    return Unit.Value;
  }
}
