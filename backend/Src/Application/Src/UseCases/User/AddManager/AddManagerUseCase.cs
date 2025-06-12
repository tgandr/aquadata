using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Manager;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.User.AddManager;

public class AddManagerUseCase : IUseCaseHandler<AddManagerInput, object>
{
  private readonly IUnitOfWork _uow;
  private readonly IManagerRepository _repository;
  private readonly IAuthenticatedUserService _authUser;
  private readonly ICouchdbService _couchDb;

  public AddManagerUseCase(
    IManagerRepository repository,
    IUnitOfWork uow,
    ICouchdbService couchdb,
    IAuthenticatedUserService authUser)
  {
    _repository = repository;
    _authUser = authUser;
    _couchDb = couchdb;
    _uow = uow;
  }

  public async Task<Result<object>> Handle(AddManagerInput request, CancellationToken cancellationToken)
  {
    var managerFromDb = await _repository.GetByPhone(request.Phone);
    var userId = _authUser.GetUserId();
    var userEmail = _authUser.GetUserEmail();

    if (managerFromDb is not null)
      return Result<object>.Fail(
        Error.Conflict(
          "Usecase.User.AddManager",
          "Manager already exists"
        )
      );

    var manager = ManagerEntity.Of(
      request.Name,
      request.Phone,
      request.Password).Unwrap();

    manager.ProducerId = userId;
    await _repository.Create(manager);
    await _couchDb.AddUser(request.Phone, request.Password);
    await _couchDb.AddMemberToDb(request.Phone, userEmail);

    var managerToAdd = new
    {
      _id = manager.Id.ToString(),
      phone = manager.Phone,
      name = manager.Name,
      dataType = "manager",
    };

    await _couchDb.AddDataToDb(userEmail, managerToAdd);
    await _uow.Commit(cancellationToken);

    return Result<object>.Ok(managerToAdd);
  }
}
