using Aquadata.Application.Errors;
using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.UseCases.User.DeleteUser;

public class DeleteUser : IRequestHandler<DeleteUserInput, Result<Unit, Exception>>
{
  private readonly IUserRepository _userRepository;
  private readonly IUnitOfWork _unitOfWork;

  public DeleteUser(IUserRepository userRepository, IUnitOfWork unitOfWork)
  {
    _userRepository = userRepository;
    _unitOfWork = unitOfWork;
  }

  public async Task<Result<Unit, Exception>> Handle(DeleteUserInput request, 
  CancellationToken cancellationToken)
  {
    var user = await _userRepository.Get(request.Id, cancellationToken);

    if (user == null)
      return Result<Unit, Exception>.Fail(new EntityNotFoundException());

    await _userRepository.Delete(user, cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    return Unit.Value;
  }
}
