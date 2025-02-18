using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Water;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.Cultivation.AddWater;

public class AddWater : IUseCaseHandler<AddWaterInput, WaterDto>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly ICultivationRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddWater(IUnitOfWork unitOfWork, 
  ICultivationRepository cultivationRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
      _unitOfWork = unitOfWork;
      _repository = cultivationRepository;
      _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<WaterDto>> Handle(AddWaterInput request, CancellationToken cancellationToken)
  {
    var waterResult = WaterEntity.Of(
      request.Date,
      request.Temperature,
      request.DissolvedOxygen,
      request.TotalAmmonia,
      request.PH
    );

    if (waterResult.IsFail)
      return Result<WaterDto>.Fail(
        Error.Validation(
          waterResult.Error.Code,
          waterResult.Error.Description
      ));

    var userId = _authenticatedUserService.GetUserId();
    var cultivationExists = await _repository.Exists(userId, 
    request.CultivationId);

    if (!cultivationExists)
     return Result<WaterDto>.Fail(
        Error.NotFound(
          "UseCases.Cultivations.AddWaterParam",
          "Cultivation not found"
        )
    );

    var water = waterResult.Unwrap();
    water.CultivationId = request.CultivationId;

    await _repository.AddWater(water);
    await _unitOfWork.Commit(cancellationToken);
        
    return Result<WaterDto>.Ok(
      WaterDto.FromEntity(water)
    );
  }
}
