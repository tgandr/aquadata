using Aquadata.Core.Enums;

namespace Aquadata.Core.Entity.Cultivation;

public class StressTest
{
  public string StressType { get; }
  public DeadLarvae DeadLarvae { get; }
  public SwimmingResponse SwimmingResponse { get; }

  public StressTest(string stressType, 
    DeadLarvae deadLarvae, SwimmingResponse swimmingResponse)
  {
    StressType = stressType;
    DeadLarvae = deadLarvae;
    SwimmingResponse = swimmingResponse;
  }
}
