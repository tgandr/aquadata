using Aquadata.Core.Enums;
using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Aquadata.Core.ValueObjects;

namespace Aquadata.Core.Entities.WaterAndAcclimation;

public class WaterAndAcclimationEntity: SeedWork.Entity
{
  public float Oxygen {get; private set;}
  public int Temperature {get; private set;}
  public PH PH {get; private set;}
  public int Salinity {get; private set;}
  public float Ammonium {get; private set;}
  public float Nitrite {get; private set;}
  public WaterAndAcclimationOrigin Origin {get; private set;}
  
  public virtual Guid? CultivationId {get;set;}

  private WaterAndAcclimationEntity() {}
  private WaterAndAcclimationEntity(float oxygen, 
   int temperature, PH pH, int salinity, 
   float ammonium,float nitrite, WaterAndAcclimationOrigin origin)
  {
    Oxygen = oxygen;
    Temperature = temperature;
    PH = pH;
    Salinity = salinity;
    Nitrite = nitrite;
    Ammonium = ammonium;
    Origin = origin;
  }

  public static Result<WaterAndAcclimationEntity> Of(
    float oxygen, 
    int temperature, PH pH, int salinity, 
    float ammonium,float nitrite, WaterAndAcclimationOrigin origin
  ) 
  => Create(new WaterAndAcclimationEntity(oxygen, temperature, pH, 
    salinity, ammonium, nitrite, origin));

  protected override Result<Entity> Validate()
  {
    return Result<Entity>.Ok(this);
  }
}
