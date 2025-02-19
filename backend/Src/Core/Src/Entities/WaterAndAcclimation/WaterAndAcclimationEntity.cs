using Aquadata.Core.Enums;
using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Vo = Aquadata.Core.ValueObjects;

namespace Aquadata.Core.Entities.WaterAndAcclimation;

public class WaterAndAcclimationEntity: SeedWork.Entity
{
  public float Oxygen {get; private set;}
  public int Temperature {get; private set;}
  public Vo.PH PH {get; private set;}
  public int Salinity {get; private set;}
  public float Ammonia {get; private set;}
  public float Nitrite {get; private set;}
  public WaterAndAcclimationOrigin Origin {get; private set;}
  
  public virtual Guid? CultivationId {get;set;}

  private WaterAndAcclimationEntity() {}
  private WaterAndAcclimationEntity(float oxygen, 
   int temperature, Vo.PH pH, int salinity, 
   float ammonia,float nitrite, WaterAndAcclimationOrigin origin)
  {
    Oxygen = oxygen;
    Temperature = temperature;
    PH = pH;
    Salinity = salinity;
    Nitrite = nitrite;
    Ammonia = ammonia;
    Origin = origin;
  }

  public static Result<WaterAndAcclimationEntity> Of(
    float oxygen,int temperature, byte pH, int salinity, 
    float ammonia,float nitrite, WaterAndAcclimationOrigin origin
  ) 
  {
    var phResult = Vo.PH.Of(pH);

    if (phResult.IsFail)
      return Result<WaterAndAcclimationEntity>.Fail(
        phResult.Error
    );

    return Create(new WaterAndAcclimationEntity(oxygen, temperature, 
    phResult.Unwrap(),salinity, ammonia, nitrite, origin));
  }
  protected override Result<Entity> Validate()
  {
    return Result<Entity>.Ok(this);
  }
}
