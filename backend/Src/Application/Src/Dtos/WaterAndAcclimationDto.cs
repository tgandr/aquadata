using System.Text.Json.Serialization;
using Aquadata.Core.Entities.WaterAndAcclimation;
using Aquadata.Core.Enums;
using Aquadata.Core.Util;
using Vo = Aquadata.Core.ValueObjects;

namespace Aquadata.Application.Dtos;

public class WaterAndAcclimationDto
{
  public float Oxygen {get; set;}
  public int Temperature {get; set;}
  public byte PH {get; set;}
  public int Salinity {get; set;}
  public float Ammonia {get; set;}
  public float Nitrite {get; set;}

  [JsonIgnore]
  public WaterAndAcclimationOrigin Origin {get; set;}

  public WaterAndAcclimationDto(float oxygen, 
  int temperature, byte pH, int salinity, 
  float ammonia, float nitrite)
  {
    Oxygen = oxygen;
    Temperature = temperature;
    PH = pH;
    Salinity = salinity;
    Ammonia = ammonia;
    Nitrite = nitrite;
  }

  public Result<WaterAndAcclimationEntity> ToEntityOrError()
    => WaterAndAcclimationEntity.Of(Oxygen, Temperature, PH, 
    Salinity, Ammonia, Nitrite, Origin);

  public static WaterAndAcclimationDto FromEntity(WaterAndAcclimationEntity waterAndAcclimation)
  {
    return new WaterAndAcclimationDto(
      waterAndAcclimation.Oxygen, waterAndAcclimation.Temperature, 
      waterAndAcclimation.PH.Value, waterAndAcclimation.Salinity, 
      waterAndAcclimation.Ammonia, waterAndAcclimation.Nitrite
    );
  }
}
