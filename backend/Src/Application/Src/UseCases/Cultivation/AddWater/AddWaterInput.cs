using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;

namespace Aquadata.Application.UseCases.Cultivation.AddWater;

public class AddWaterInput: IUseCaseRequest<WaterDto>
{
  public DateTime Date {get;}
  public int Temperature {get;}
  public float DissolvedOxygen {get;}
  public float TotalAmmonia {get;}
  public byte PH {get;}
  public virtual Guid CultivationId {get;}

  public AddWaterInput(DateTime date, int temperature, float dissolvedOxygen, 
  float totalAmmonia,byte pH, Guid cultivationId)
  {
    Date = date;
    Temperature = temperature;
    DissolvedOxygen = dissolvedOxygen;
    TotalAmmonia = totalAmmonia;
    PH = pH;
    CultivationId = cultivationId;
  }
}
