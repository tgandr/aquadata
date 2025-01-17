using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Biometric;

public class BiometricEntity : SeedWork.Entity
{
  public float Count {get; private set;}
  public float AverageWeight {get; private set;}
  public DateTime Date {get; private set;}

  public virtual Guid? CultivationId {get;set;}
  public virtual Guid? HarverstId {get;set;}
  
  private BiometricEntity() {}
  private BiometricEntity(float count, float averageWeight, DateTime date)
  {
    Count = float.Abs(count);
    AverageWeight = float.Abs(averageWeight);
    Date = date;
  }

  public static Result<BiometricEntity> Of(float count, float averageWeight, DateTime date)
    => Create(new BiometricEntity(count, averageWeight, date));

  protected override Result<Entity> Validate()
    => Result<Entity>.Ok(this);
}
