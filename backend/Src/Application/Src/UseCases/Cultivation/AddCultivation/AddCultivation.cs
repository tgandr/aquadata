using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.WaterAndAcclimation;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Cultivation.AddCultivation;

public class AddCultivation : IUseCaseHandler<AddCultivationInput, Unit>
{
  private readonly IPondRepository _pondRepository;
  private readonly IUnitOfWork _unitOfWork;

  public AddCultivation(IPondRepository pondRepository, IUnitOfWork unitOfWork)
  {
    _pondRepository = pondRepository;
    _unitOfWork = unitOfWork;
  }
  public async Task<Result<Unit>> Handle(AddCultivationInput request, CancellationToken cancellationToken)
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
    cultivation.PondId = request.PondId;
    
    if (request.StressTest != null) 
    {
      var result = request.StressTest.ToEntityOrError();
      if (result.IsFail)
        return Result<Unit>.Fail(
          Error.Validation(
            "UseCases.Cultivation.AddCultivation", 
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
            "UseCases.Cultivation.AddCultivation", 
            inPondResult.Error.Description
        ));

      if (inTransportResult.IsFail)
        return Result<Unit>.Fail(
          Error.Validation(
            "UseCases.Cultivation.AddCultivation", 
            inTransportResult.Error.Description
        ));
      
      cultivation.AddWaterAndAcclimation(new List<WaterAndAcclimationEntity>{
        inPondResult.Unwrap(),
        inTransportResult.Unwrap()
      });
    }

    await _pondRepository.AddCultivation(cultivation, cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);
  }
}
