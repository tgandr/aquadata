using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.User.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.User.UpdateUser;

public class UpdateUser: IUseCaseHandler<UpdateUserInput,UserOutput>
{
  private readonly IUserRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;
  private readonly IUnitOfWork _unitOfWork;

  public UpdateUser(IUserRepository repository, IUnitOfWork unitOfWork,
  IAuthenticatedUserService authenticatedUserService)
  {
    _repository = repository;
    _unitOfWork = unitOfWork;
    _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<UserOutput>> Handle(UpdateUserInput request, 
  CancellationToken cancellationToken)
  {
    var user = await _repository.Get(request.Id, cancellationToken);

    if (user == null)
    {
      return Result<UserOutput>.Fail(
        Error.NotFound(
          "UseCases.User.UpdateUser",
          "User not found'"
        )
      );
    }

    var userId = _authenticatedUserService.GetUserId();

    if (userId != user.Id) 
      return Result<UserOutput>.Fail(
        Error.Unauthorized(
          "UseCases.User.UpdateUser",
          "Unauthorized"
        )
    );
    
    var updateResult = user!.Update(
      request.Name, request.Profile,
      request.FarmName, request.FarmAddress, request.Phone
    );

    if (updateResult.IsFail)
      return Result<UserOutput>.Fail(updateResult.Error!);

    await _repository.Update(user, cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    return Result<UserOutput>.Ok(
      UserOutput.FromEntity(user)
    );
  }
}
