using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.User.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.User.GetByEmail;

public class GetUserByEmail : IUseCaseHandler<GetUserByEmailInput, UserOutput>
{
  private readonly IUserRepository _repository;

  public GetUserByEmail(IUserRepository repository)
    => _repository = repository;
  public async Task<Result<UserOutput>> Handle(GetUserByEmailInput request, CancellationToken cancellationToken)
  {
    var user = await _repository.GetByEmail(request.Email);

    if (user == null)
      return Result<UserOutput>.Fail(
        Error.NotFound(
          "UseCases.User.DeleteUser",
          "User not found'"
        )
      );
    
    return Result<UserOutput>.Ok(
      UserOutput.FromEntity(user)
    );
  }
}
