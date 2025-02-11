using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Harvest;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.Cultivation.AddHarvest;

public class AddHarvest: IUseCaseHandler<AddHarvestInput, HarvestDto>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly ICultivationRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddHarvest(IUnitOfWork unitOfWork, 
  ICultivationRepository cultivationRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
    _unitOfWork = unitOfWork;
    _repository = cultivationRepository;
    _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<HarvestDto>> Handle(AddHarvestInput request, CancellationToken cancellationToken)
  {
    var harvestResult = HarvestEntity.Of(
      request.Buyer,
      request.Price,
      request.Date,
      request.IsTotal,
      request.BioMass
    );
    
    if (harvestResult.IsFail)
      return Result<HarvestDto>.Fail(harvestResult.Error);

    var userId = _authenticatedUserService.GetUserId() ?? "";
    var cultivationExists = await _repository.Exists(userId, 
    request.CultivationId.ToString());

    if (!cultivationExists)
     return Result<HarvestDto>.Fail(
        Error.NotFound(
          "UseCases.Cultivations.AddHarvest",
          "Cultivation not found"
        )
    );

    var harvest = harvestResult.Unwrap();
    harvest.CultivationId = request.CultivationId;
    harvest.Biometrics = request.Biometrics.Select(dto => BiometricDto.ToEntity(dto, harvest.CultivationId)).ToList();

    await _repository.AddHarvest(harvest);
    await _unitOfWork.Commit(cancellationToken);
        
    return Result<HarvestDto>.Ok(
      HarvestDto.FromEntity(harvest)
    );
  }
}
