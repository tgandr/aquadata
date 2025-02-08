using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Biometric;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MediatR;

namespace Aquadata.Application.UseCases.Cultivation.AddBiometric;

public class AddBiometric : IUseCaseHandler<AddBiometricInput, Unit>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly ICultivationRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddBiometric(IUnitOfWork unitOfWork, 
  ICultivationRepository cultivationRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
      _unitOfWork = unitOfWork;
      _repository = cultivationRepository;
      _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<Unit>> Handle(AddBiometricInput request, 
  CancellationToken cancellationToken)
  {
    var biometricResult = BiometricEntity.Of(
      request.Count,
      request.AverageWeight,
      request.Date
    );

    if (biometricResult.IsFail)
      return Result<Unit>.Fail(
        Error.Validation(
          "UseCases.Cultivations.AddBiometric",
          biometricResult.Error.Description
        )
    );

    var userId = _authenticatedUserService.GetUserId() ?? "";
    var cultivationExists = await _repository.Exists(userId, 
    request.CultivationId.ToString());

    if (!cultivationExists)
     return Result<Unit>.Fail(
        Error.NotFound(
          "UseCases.Cultivations.AddBiometric",
          "Cultivation not found"
        )
    );

    var biometric = biometricResult.Unwrap();
    biometric.CultivationId = request.CultivationId;
    
    await _repository.AddBiometric(biometric);
    await _unitOfWork.Commit(cancellationToken);

    return Result<Unit>.Ok(Unit.Value);  
  }
}
