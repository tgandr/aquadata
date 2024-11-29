using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Objective;

public class ObjectiveEntity: SeedWork.Entity
{
  public int Days {get;}
  public float AverageSize {get;}
  public float SurvivalRate {get;}

  private ObjectiveEntity(int days, float averageSize, float survivalRate)
  {
    Days = days;
    AverageSize = averageSize;
    SurvivalRate = survivalRate;
  }

  public static Result<ObjectiveEntity, ModelValidationException> Of(int days, 
  float averageSize, float survivalRate)
   => Create(new ObjectiveEntity(days, averageSize, survivalRate));

  protected override Result<ModelValidationException> Validate()
  {
    return Result<ModelValidationException>.Ok();
  }
}
