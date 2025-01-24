using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Objective;

public class ObjectiveEntity: SeedWork.Entity
{
  public int Days {get; private set;}
  public float AverageSize {get; private set;}
  public float SurvivalRate {get; private set;}
  public virtual Guid? CultivationId {get; set;}	
  
  private ObjectiveEntity() {}
  private ObjectiveEntity(int days, float averageSize, float survivalRate)
  {
    Days = days;
    AverageSize = averageSize;
    SurvivalRate = survivalRate;
  }

  public static Result<ObjectiveEntity> Of(int days, 
  float averageSize, float survivalRate)
   => Create(new ObjectiveEntity(days, averageSize, survivalRate));

  protected override Result<Entity> Validate()
  {
    return Result<Entity>.Ok(this);
  }
}
