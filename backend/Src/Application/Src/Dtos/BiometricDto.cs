using Aquadata.Core.Entities.Biometric;

namespace Aquadata.Application.Dtos;

public class BiometricDto
{
  public float Count {get;}
  public float AverageWeight {get;}
  public DateTime Date {get;}

  public BiometricDto(float count, float averageWeight, DateTime date)
  {
    Count = count;
    AverageWeight = averageWeight;
    Date = date;
  }

  public static BiometricDto FromEntity(BiometricEntity entity)
    => new(entity.Count, entity.AverageWeight, entity.Date);
}
