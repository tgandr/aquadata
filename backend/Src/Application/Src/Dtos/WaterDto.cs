using Aquadata.Core.Entities.Water;

namespace Aquadata.Application.Dtos;

public class WaterDto
{
  public DateTime Date {get;}
  public int Temperature {get;}
  public float DissolvedOxygen {get;}
  public float TotalAmmonia {get;}
  public byte PH {get;}

  public WaterDto(DateTime date, int temperature, float dissolvedOxygen, 
  float totalAmmonia, byte pH)
  {
    Date = date;
    Temperature = temperature;
    DissolvedOxygen = dissolvedOxygen;
    TotalAmmonia = totalAmmonia;
    PH = pH;
  }

  public static WaterDto FromEntity(WaterEntity entity)
    => new(
      entity.Date, 
      entity.Temperature, 
      entity.DissolvedOxygen, entity.TotalAmmonia, 
      entity.PH.Value
    );
}
