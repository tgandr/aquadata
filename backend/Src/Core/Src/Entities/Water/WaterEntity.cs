using Aquadata.Core.Errors;
using Aquadata.Core.Util;
using Aquadata.Core.ValueObjects;

namespace Aquadata.Core.Entities.Water;

public class WaterEntity : SeedWork.Entity
{
  public DateTime Date {get; private set;}
  public int Temperature {get; private set;}
  public float DissolvedOxygen {get; private set;}
  public PH PH {get; private set;}

  public virtual Guid? CultivationId {get;set;}

  private WaterEntity(){}
  private WaterEntity(DateTime date, int temperature, float dissolvedOxygen, PH pH)
  {
    Date = date;
    Temperature = temperature;
    DissolvedOxygen = dissolvedOxygen;
    PH = pH;
  }

  public static Result<WaterEntity, ModelValidationException> Of(DateTime date, int temperature, float dissolvedOxygen, PH pH)
    => Create(new WaterEntity(date, temperature, dissolvedOxygen, pH));

  protected override Result<ModelValidationException> Validate()
    => Result<ModelValidationException>.Ok();    
  
}
