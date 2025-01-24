using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.UseCases.Cultivation.AddCultivation;

public class AddCultivation : IApplicationHandler<AddCultivationInput, Unit>
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

    await _pondRepository.AddCultivation(cultivation, cancellationToken);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);
  }
}
