using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Enums;
using Aquadata.Core.ValueObjects;

namespace Aquadata.Core.Builders;

public class CultivationOptionalBuilder
{
  private CultivationOptional _value = new CultivationOptional();

  public CultivationOptionalBuilder StressTest(string stressType, 
    DeadLarvae deadLarvae, SwimmingResponse swimmingResponse)
  {
    _value.StressTest = new StressTest(stressType, deadLarvae, swimmingResponse);
    return this;
  }

  public CultivationOptionalBuilder WaterAndAcclimation(
    float oxygen, int temperature, byte pH, 
    int salinity, float ammonium,
    float nitrite)
  {
    _value.WaterAndAcclimation = new WaterAndAcclimation(oxygen, temperature, 
      PH.Of(pH).Unwrap(), salinity, ammonium, nitrite);

    return this;
  }

  public CultivationOptionalBuilder Objective(int days, float averageSize, float survivalRate)
  {
    _value.Objective = new Objective(days, averageSize, survivalRate);
    return this;
  }

  public CultivationOptional Build()
    => _value;
  
}
