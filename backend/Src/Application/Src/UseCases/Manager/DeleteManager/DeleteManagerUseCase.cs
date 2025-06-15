using Aquadata.Application.Interfaces;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Manager.DeleteManager;

public class DeleteManagerUseCase : IUseCaseHandler<DeleteManagerInput, Unit>
{
  private readonly IAuthenticatedUserService _authUser;
  private readonly IManagerRepository _repository;
  private readonly ICouchdbService _couchDb;
  private readonly IUnitOfWork _uow;

  public DeleteManagerUseCase(
    IAuthenticatedUserService authUser,
    IManagerRepository repository,
    IUnitOfWork uow,
    ICouchdbService couchdb)
  {
    _authUser = authUser;
    _couchDb = couchdb;
    _uow = uow;
    _repository = repository;
  }

  public async Task<Result<Unit>> Handle(DeleteManagerInput request, CancellationToken cancellationToken)
  {
    var managerFromDb = await _repository.GetByPhone(request.Phone);
    var userId = _authUser.GetUserId();
    var userEmail = _authUser.GetUserEmail();

    if (managerFromDb is null)
      return Result<Unit>.Fail(
        Error.NotFound(
          "UseCases.Managers.Delete",
          "Manager not found"
        )
      );

    if (managerFromDb.ProducerId != userId)
      return Result<Unit>.Fail(
        Error.Unauthorized(
          "UseCases.Managers.Delete",
          "You are not authorized to delete this manager"
        )
      );

    await _repository.Delete(managerFromDb);
    await _couchDb.DeleteData(userEmail, managerFromDb.Id.ToString());
    await _couchDb.RemoveMemberToDb(request.Phone, userEmail);
    await _couchDb.RemoveUser(request.Phone);
    await _uow.Commit(cancellationToken);
    return Result<Unit>.Ok(Unit.Value);
  }
}
