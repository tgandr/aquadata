using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.WaterAndAcclimation;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Cultivation.CreateCultivation;

public class CreateCultivation : IUseCaseHandler<CreateCultivationInput, Unit>
{
  private readonly IPondRepository _pondRepository;
  private readonly IAuthenticatedUserService _authenticatedUserService;
  private readonly IUnitOfWork _unitOfWork;

  public CreateCultivation(IPondRepository pondRepository, 
  IUnitOfWork unitOfWork, IAuthenticatedUserService authenticatedUserService)
  {
    _authenticatedUserService = authenticatedUserService;
    _pondRepository = pondRepository;
    _unitOfWork = unitOfWork;
  }
  public async Task<Result<Unit>> Handle(CreateCultivationInput request, CancellationToken cancellationToken)
  {
    var cultivationResult = CultivationEntity.Of(
      request.PondNumber,
      request.Stock,
      request.PLOrigin,
      request.WaterAndAcclimationChecked,
      request.Uniformity,
      request.SettlementDate
    );

    if (cultivationResult.IsFail)
      return Result<Unit>.Fail(cultivationResult.Error);

    var cultivation = cultivationResult.Unwrap();
    var userId = _authenticatedUserService.GetUserId() ?? "";
    var pondExists = await _pondRepository.Exists(userId, request.PondId.ToString());

    if (!pondExists)
      return Result<Unit>.Fail(
        Error.NotFound(
          "UseCases.Cultivation.Create",
          "Pond not found"
    ));
    
    cultivation.PondId = request.PondId;
    
    if (request.StressTest != null) 
    {
      var result = request.StressTest.ToEntityOrError();
      if (result.IsFail)
        return Result<Unit>.Fail(
          Error.Validation(
            "UseCases.Cultivation.Create", 
            result.Error.Description
          ));
      cultivation.StressTest = result.Unwrap();
    }

    if (request.WaterAndAcclimation != null) 
    {
      var inPondResult = request.WaterAndAcclimation.InPond.ToEntityOrError();
      var inTransportResult = request.WaterAndAcclimation.InTransport.ToEntityOrError();

      if (inPondResult.IsFail)
        return Result<Unit>.Fail(
          Error.Validation(
            "UseCases.Cultivation.Create", 
            inPondResult.Error.Description
        ));

      if (inTransportResult.IsFail)
        return Result<Unit>.Fail(
          Error.Validation(
            "UseCases.Cultivation.Create", 
            inTransportResult.Error.Description
        ));
      
      cultivation.AddWaterAndAcclimation(new List<WaterAndAcclimationEntity>{
        inPondResult.Unwrap(),
        inTransportResult.Unwrap()
      });
    }

    await _pondRepository.CreateCultivation(cultivation, cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);
  }
}
