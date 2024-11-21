using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Biometric;

public class BiometricEntity : SeedWork.Entity
{
  public float Count {get;}
  public float AverageWeight {get;}
  public DateTime Date {get;}

  private BiometricEntity(float count, float averageWeight, DateTime date)
  {
    Count = float.Abs(count);
    AverageWeight = float.Abs(averageWeight);
    Date = date;
  }

  public static Result<BiometricEntity, ModelValidationException> Of(float count, float averageWeight, DateTime date)
    => Create(new BiometricEntity(count, averageWeight, date));

  protected override Result<ModelValidationException> Validate()
    => Result<ModelValidationException>.Ok();
}
