using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Objective;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Cultivation.AddObjective;

public class AddObjective : IUseCaseHandler<AddObjectiveInput, Unit>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly IAuthenticatedUserService _authenticatedUserService;
  private readonly ICultivationRepository _repository;

  public AddObjective(IUnitOfWork unitOfWork,
  ICultivationRepository repository, IAuthenticatedUserService authenticatedUserService)
  { 
    _unitOfWork = unitOfWork;
    _repository = repository;
    _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<Unit>> Handle(AddObjectiveInput request, CancellationToken cancellationToken)
  {
    var objectiveResult = ObjectiveEntity.Of(
      request.Days, 
      request.AverageSize, 
      request.SurvivalRate);
    
    if (objectiveResult.IsFail)
      return Result<Unit>.Fail(
        Error.Validation(
          "UseCases.Cultivations.AddObjective",
          objectiveResult.Error.Description
        )
      );
    
    var userId = _authenticatedUserService.GetUserId() ?? "";
    var cultivationExists = await _repository.Exists(userId, 
    request.CultivationId.ToString());

    if (!cultivationExists)
     return Result<Unit>.Fail(
        Error.NotFound(
          "UseCases.Cultivations.AddObjective",
          "Cultivation not found"
        )
    );
  
    var objective = objectiveResult.Unwrap();
    objective.CultivationId = request.CultivationId;
    
    await _repository.AddObjective(objective);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);  
  }
}
