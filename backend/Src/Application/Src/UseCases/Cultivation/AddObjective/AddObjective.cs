using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Objective;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Cultivation.AddObjective;

public class AddObjective : IUseCaseHandler<AddObjectiveInput, ObjectiveDto>
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

  public async Task<Result<ObjectiveDto>> Handle(AddObjectiveInput request, CancellationToken cancellationToken)
  {
    var objectiveResult = ObjectiveEntity.Of(
      request.Days, 
      request.AverageSize, 
      request.SurvivalRate);
    
    if (objectiveResult.IsFail)
      return Result<ObjectiveDto>.Fail(
        Error.Validation(
          objectiveResult.Error.Code,
          objectiveResult.Error.Description
        )
      );
    
    var userId = _authenticatedUserService.GetUserId() ?? "";
    var cultivationExists = await _repository.Exists(userId, 
    request.CultivationId.ToString());

    if (!cultivationExists)
     return Result<ObjectiveDto>.Fail(
        Error.NotFound(
          "UseCases.Cultivations.AddObjective",
          "Cultivation not found"
        )
    );
  
    var objective = objectiveResult.Unwrap();
    objective.CultivationId = request.CultivationId;
    
    await _repository.AddObjective(objective);
    await _unitOfWork.Commit(cancellationToken);

    return Result<ObjectiveDto>.Ok(
      ObjectiveDto.FromEntity(objective)
    );  
  }
}
