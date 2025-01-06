using Aquadata.Application.Errors;
using Aquadata.Application.UseCases.User.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.UseCases.User.GetUser;

public class GetUser : IRequestHandler<GetUserInput, Result<UserOutput, Exception>>
{
  private readonly IUserRepository _repository;

  public GetUser(IUserRepository repository)
    => _repository = repository;
    
  public async Task<Result<UserOutput, Exception>> Handle(GetUserInput request, 
  CancellationToken cancellationToken)
  {
    var user = await _repository.Get(request.Id, cancellationToken); 

    if (user == null)
    {
      return Result<UserOutput, Exception>.Fail(
        new EntityNotFoundException()
      );
    }

    return Result<UserOutput, Exception>.Ok(
      UserOutput.FromEntity(user)
    );
  }
}
