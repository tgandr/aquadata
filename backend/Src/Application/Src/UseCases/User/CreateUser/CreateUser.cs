using Application.UseCases.User.CreateUser;
using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.User.Common;
using Aquadata.Core.Entities.Financial;
using Aquadata.Core.Entities.User;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.User.CreateUser;

public class CreateUser : IUseCaseHandler<CreateUserInput,UserOutput>
{
  private readonly IUserRepository _repository;
  private readonly IUnitOfWork _unitOfWork;

  public CreateUser(IUserRepository repository, IUnitOfWork unitOfWork)
  {
    _repository = repository;
    _unitOfWork = unitOfWork;
  }

  public async Task<Result<UserOutput>> Handle(CreateUserInput request, 
  CancellationToken cancellationToken)
  {
    var userResult = UserEntity.Of(
      request.Name,
      request.Email,
      request.Password,
      request.Profile,
      request.FarmName,
      request.FarmAddress,
      request.Phone
    );

    var userExists = await _repository.IsEmailRegistered(request.Email);

    if (userExists)
      return Result<UserOutput>.Fail(
        Error.Conflict(
        "UserService.Signup",
        "Email already exists"
      ));

    if (userResult.IsFail) {
      return Result<UserOutput>.Fail(userResult.Error!);
    }

    var user = userResult.Unwrap();
    await _repository.Insert(user, cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    await _repository.Insert(FinancialEntity.Of(user.Id));
    await _unitOfWork.Commit(cancellationToken);


    return Result<UserOutput>.Ok(
      UserOutput.FromEntity(user)
    );
  }
}
