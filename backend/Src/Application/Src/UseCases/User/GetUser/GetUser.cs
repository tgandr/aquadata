using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.User.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.User.GetUser;

public class GetUser : IUseCaseHandler<GetUserInput,UserOutput>
{
  private readonly IUserRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public GetUser(IUserRepository repository, 
  IAuthenticatedUserService authenticatedUserService)
  {
    _repository = repository;
    _authenticatedUserService = authenticatedUserService;
  }
    
  public async Task<Result<UserOutput>> Handle(GetUserInput request, 
  CancellationToken cancellationToken)
  {
    var user = await _repository.Get(request.Id, cancellationToken); 

    if (user == null)
    {
      return Result<UserOutput>.Fail(
        Error.NotFound(
          "UseCases.User.DeleteUser",
          "User not found'"
        )
      );
    }

    var userId = _authenticatedUserService.GetUserId();
    
    if (userId != user.Id)
      return Result<UserOutput>.Fail(
        Error.Unauthorized(
          "UseCases.Pond.Deactivate",
          "Unauthorized"
        )
    );

    return Result<UserOutput>.Ok(
      UserOutput.FromEntity(user)
    );
  }
}
