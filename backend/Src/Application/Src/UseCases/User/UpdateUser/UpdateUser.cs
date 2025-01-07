using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.User.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.User.UpdateUser;

public class UpdateUser: IApplicationHandler<UpdateUserInput,UserOutput>
{
  private readonly IUserRepository _repository;
  private readonly IUnitOfWork _unitOfWork;

  public UpdateUser(IUserRepository repository, IUnitOfWork unitOfWork)
  {
      _repository = repository;
      _unitOfWork = unitOfWork;
  }

  public async Task<Result<UserOutput>> Handle(UpdateUserInput request, 
  CancellationToken cancellationToken)
  {
    var user = await _repository.Get(request.Id, cancellationToken);

    if (user == null)
    {
      return Result<UserOutput>.Fail(
        Error.NotFound(
          "User.UseCases.UpdateUser",
          "User not found'"
        )
      );
    }

    var updateResult = user!.Update(
      request.Name, request.Email, request.Password, request.Profile,
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
