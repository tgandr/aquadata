using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Vo = Aquadata.Core.ValueObjects;

namespace Aquadata.Core.Entities.Water;

public class WaterEntity : Entity
{
  public DateTime Date {get; private set;}
  public int Temperature {get; private set;}
  public float DissolvedOxygen {get; private set;}
  public float TotalAmmonia {get;private set;}
  public Vo.PH PH {get; private set;}

  public virtual Guid? CultivationId {get;set;}

  private WaterEntity(){}
  private WaterEntity(DateTime date, int temperature, float dissolvedOxygen, 
  float totalAmmonia, Vo.PH pH)
  {
    Date = date;
    Temperature = temperature;
    DissolvedOxygen = dissolvedOxygen;
    TotalAmmonia = totalAmmonia;
    PH = pH;
  }

  public static Result<WaterEntity> Of(DateTime date, int temperature, float dissolvedOxygen,
  float totalAmmonia, byte pH)
  {
    var phResult = Vo.PH.Of(pH);

    if (phResult.IsFail)
      return Result<WaterEntity>.Fail(phResult.Error);

    return Create(new WaterEntity(
      date, temperature, dissolvedOxygen,totalAmmonia,
      phResult.Unwrap()));
  }
  
  protected override Result<Entity> Validate()
    => Result<Entity>.Ok(this);    
  
}
