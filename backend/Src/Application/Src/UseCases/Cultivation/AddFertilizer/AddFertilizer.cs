using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Fertilizer;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.Cultivation.AddFertilizer;

public class AddFertilizer : IUseCaseHandler<AddFertilizerInput, FertilizerDto>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly ICultivationRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddFertilizer(IUnitOfWork unitOfWork, 
  ICultivationRepository cultivationRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
      _unitOfWork = unitOfWork;
      _repository = cultivationRepository;
      _authenticatedUserService = authenticatedUserService;
  }
  public async Task<Result<FertilizerDto>> Handle(AddFertilizerInput request, 
  CancellationToken cancellationToken)
  {
    var fertilizerResult = FertilizerEntity.Of(
      request.Name,
      request.Date,
      request.Type,
      request.Quantity,
      request.MeasureUnit
    ); 

    if (fertilizerResult.IsFail)
      return Result<FertilizerDto>.Fail(fertilizerResult.Error);

    var userId = _authenticatedUserService.GetUserId();
    var cultivationExists = await _repository.Exists(userId, 
    request.CultivationId);

    if (!cultivationExists)
     return Result<FertilizerDto>.Fail(
        Error.NotFound(
          "UseCases.Cultivations.AddFertilizer",
          "Cultivation not found"
        )
    );

    var fertilizer = fertilizerResult.Unwrap();
    fertilizer.CultivationId = request.CultivationId;

    await _repository.AddFertilizer(fertilizer);
    await _unitOfWork.Commit(cancellationToken);

    return Result<FertilizerDto>.Ok(
      FertilizerDto.FromEntity(fertilizer)
    );
  }
}
