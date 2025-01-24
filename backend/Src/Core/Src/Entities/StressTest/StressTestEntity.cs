using Aquadata.Core.Enums;
using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.Entities.StressTest;

public class StressTestEntity: SeedWork.Entity
{
  public string StressType { get; }
  public DeadLarvae DeadLarvae { get; }
  public SwimmingResponse SwimmingResponse { get; }
  public virtual Guid? CultivationId {get;set;}
  
  private StressTestEntity(){}
  private StressTestEntity(string stressType, 
    DeadLarvae deadLarvae, SwimmingResponse swimmingResponse)
  {
    StressType = stressType;
    DeadLarvae = deadLarvae;
    SwimmingResponse = swimmingResponse;
  }

  public static Result<StressTestEntity> Of(string stressType, 
    DeadLarvae deadLarvae, SwimmingResponse swimmingResponse)
  => Create(new StressTestEntity(stressType, deadLarvae, swimmingResponse));

  protected override Result<Entity> Validate()
  {
    if (string.IsNullOrWhiteSpace(StressType))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.StressTest",
          "Test type cannot be empty or null"
        )
      );

    return Result<Entity>.Ok(this);
  }
}
