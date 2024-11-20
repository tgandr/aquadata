using Aquadata.Core.Entity.Cultivation;
using Aquadata.Core.Enums;

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
    WaterAndAcclimationParam oxygen, 
    WaterAndAcclimationParam temperature, WaterAndAcclimationParam pH, 
    WaterAndAcclimationParam salinity, WaterAndAcclimationParam ammonium,
    WaterAndAcclimationParam nitrite)
  {
    _value.WaterAndAcclimation = new WaterAndAcclimation(oxygen, temperature, 
      pH, salinity, ammonium, nitrite);

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
