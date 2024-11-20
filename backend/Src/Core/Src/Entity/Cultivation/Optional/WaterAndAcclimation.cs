namespace Aquadata.Core.Entity.Cultivation;

public class WaterAndAcclimationParam
{
  public float Transport {get;}
  public int PondNumber {get;}

  public WaterAndAcclimationParam(float transport, int pondNumber)
  {
    Transport = transport;
    PondNumber = pondNumber;
  }
}

public class WaterAndAcclimation
{
  public WaterAndAcclimationParam Oxygen {get;}
  public WaterAndAcclimationParam Temperature {get;}
  public WaterAndAcclimationParam PH {get;}
  public WaterAndAcclimationParam Salinity {get;}
  public WaterAndAcclimationParam Ammonium {get;}
  public WaterAndAcclimationParam Nitrite {get;}

  public WaterAndAcclimation(WaterAndAcclimationParam oxygen, 
  WaterAndAcclimationParam temperature, WaterAndAcclimationParam pH, 
  WaterAndAcclimationParam salinity, WaterAndAcclimationParam ammonium,
  WaterAndAcclimationParam nitrite)
  {
    Oxygen = oxygen;
    Temperature = temperature;
    PH = pH;
    Salinity = salinity;
    Nitrite = nitrite;
    Ammonium = ammonium;
  }
}
