using Aquadata.Core.Enums;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.StressTest;

public class StressTestEntity: SeedWork.Entity
{
  public string StressType { get; }
  public DeadLarvae DeadLarvae { get; }
  public SwimmingResponse SwimmingResponse { get; }
  public virtual Guid? CultivationId {get;set;}

  private StressTestEntity(string stressType, 
    DeadLarvae deadLarvae, SwimmingResponse swimmingResponse)
  {
    StressType = stressType;
    DeadLarvae = deadLarvae;
    SwimmingResponse = swimmingResponse;
  }

  public static Result<StressTestEntity, ModelValidationException> Of(string stressType, 
    DeadLarvae deadLarvae, SwimmingResponse swimmingResponse)
  => Create(new StressTestEntity(stressType, deadLarvae, swimmingResponse));

  protected override Result<ModelValidationException> Validate()
  {
    if (string.IsNullOrWhiteSpace(StressType))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("Stress Test type cannot be empty or null")
      );

    return Result<ModelValidationException>.Ok();
  }
}
