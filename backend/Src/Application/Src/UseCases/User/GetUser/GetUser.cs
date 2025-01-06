using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.User.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.User.GetUser;

public class GetUser : IApplicationHandler<GetUserInput,UserOutput>
{
  private readonly IUserRepository _repository;

  public GetUser(IUserRepository repository)
    => _repository = repository;
    
  public async Task<Result<UserOutput>> Handle(GetUserInput request, 
  CancellationToken cancellationToken)
  {
    var user = await _repository.Get(request.Id, cancellationToken); 

    if (user == null)
    {
      return Result<UserOutput>.Fail(
        Error.NotFound(
          "User.UseCases.DeleteUser",
          "User not found'"
        )
      );
    }

    return Result<UserOutput>.Ok(
      UserOutput.FromEntity(user)
    );
  }
}
