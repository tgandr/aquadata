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
  public float Ammonium {get; set;}
  public float Nitrite {get; set;}

  [JsonIgnore]
  public WaterAndAcclimationOrigin Origin {get; set;}

  public WaterAndAcclimationDto(float oxygen, 
  int temperature, byte pH, int salinity, 
  float ammonium, float nitrite)
  {
    Oxygen = oxygen;
    Temperature = temperature;
    PH = pH;
    Salinity = salinity;
    Ammonium = ammonium;
    Nitrite = nitrite;
  }

  public Result<WaterAndAcclimationEntity> ToEntityOrError()
  {
    var phResult = Vo.PH.Of(PH);

    if (phResult.IsFail)
    {
      return Result<WaterAndAcclimationEntity>.Fail(phResult.Error);
    }

    return WaterAndAcclimationEntity.Of(Oxygen, Temperature, phResult.Unwrap(), Salinity, Ammonium, Nitrite, Origin);
  }
}
