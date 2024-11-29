using Aquadata.Core.Enums;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;
using Aquadata.Core.ValueObjects;

namespace Aquadata.Core.Entities.WaterAndAcclimation;

public class WaterAndAcclimationEntity: SeedWork.Entity
{
  public float Oxygen {get;}
  public int Temperature {get;}
  public PH PH {get;}
  public int Salinity {get;}
  public float Ammonium {get;}
  public float Nitrite {get;}
  public WaterAndAcclimationOrigin Origin {get;}
  
  public virtual Guid? CultivationId {get;set;}

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

  public static Result<WaterAndAcclimationEntity, ModelValidationException> Of(
    float oxygen, 
    int temperature, PH pH, int salinity, 
    float ammonium,float nitrite, WaterAndAcclimationOrigin origin
  ) 
  => Create(new WaterAndAcclimationEntity(oxygen, temperature, pH, 
    salinity, ammonium, nitrite, origin));

  protected override Result<ModelValidationException> Validate()
  {
    return Result<ModelValidationException>.Ok();
  }
}
