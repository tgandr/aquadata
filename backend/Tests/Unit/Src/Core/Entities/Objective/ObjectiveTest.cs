using Aquadata.Core.Entities.Objective;

namespace Aquadata.UnitTests.Core.Entities.Objective;

public class ObjectiveTest
{
  [Fact]
  public void CreateValidObjective()
  {
    var expected = new
    {
        Days = 10,
        AverageSize = 2.6f,
        SurvivalRate = 5.6f
    };

    var current = ObjectiveEntity.Of(
      expected.Days,
      expected.AverageSize,
      expected.SurvivalRate
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.Days, current.Days);
    Assert.Equal(expected.AverageSize, current.AverageSize);
    Assert.Equal(expected.SurvivalRate, current.SurvivalRate);
  }
}
