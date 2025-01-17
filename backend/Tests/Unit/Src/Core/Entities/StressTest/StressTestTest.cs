using Aquadata.Core.Entities.StressTest;
using Aquadata.Core.Enums;


namespace Aquadata.UnitTests.Core.Entities.StressTest;

public class StressTestTest
{
  [Fact]
  public void CreateValidStressTest()
  {
    var expected = new {
      StressType = "stress type",
      DeadLarvae = DeadLarvae.Many,
      SwimmingResponse = SwimmingResponse.Medium,
    };

    var current = StressTestEntity.Of(
      expected.StressType,
      expected.DeadLarvae,
      expected.SwimmingResponse
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.StressType, current.StressType);
    Assert.Equal(expected.DeadLarvae, current.DeadLarvae);
    Assert.Equal(expected.SwimmingResponse, current.SwimmingResponse);
  }
}
