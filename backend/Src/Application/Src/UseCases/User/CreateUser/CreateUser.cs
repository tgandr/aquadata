using Application.UseCases.User.CreateUser;
using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.User.Common;
using Aquadata.Core.Entities.User;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.UseCases.User.CreateUser;

public class CreateUser : IRequestHandler<CreateUserInput, Result<UserOutput, Exception>>
{
  private readonly IUserRepository _repository;
  private readonly IUnitOfWork _unitOfWork;

  public CreateUser(IUserRepository repository, IUnitOfWork unitOfWork)
  {
    _repository = repository;
    _unitOfWork = unitOfWork;
  }

  public async Task<Result<UserOutput, Exception>> Handle(CreateUserInput request, 
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

    if (userResult.IsFail) {
      return Result<UserOutput, Exception>.Fail(userResult.Error!);
    }

    await _repository.Insert(userResult.Unwrap(), cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    return Result<UserOutput, Exception>.Ok(
      UserOutput.FromEntity(userResult.Unwrap())
    );
  }
}
