using Aquadata.Core.ValueObjects;

namespace Aquadata.Core.Entities.Cultivation;

public class WaterAndAcclimation
{
  public float Oxygen {get;}
  public int Temperature {get;}
  public PH PH {get;}
  public int Salinity {get;}
  public float Ammonium {get;}
  public float Nitrite {get;}

  public WaterAndAcclimation(float oxygen, 
   int temperature, PH pH, int salinity, 
   float ammonium,float nitrite)
  {
    Oxygen = oxygen;
    Temperature = temperature;
    PH = pH;
    Salinity = salinity;
    Nitrite = nitrite;
    Ammonium = ammonium;
  }
}
