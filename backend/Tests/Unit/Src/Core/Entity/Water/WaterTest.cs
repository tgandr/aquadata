using Aquadata.Core.Entities.Water;
using Aquadata.Core.ValueObjects;

namespace Aquadata.UnitTests.Core.Entity.Water;

public class WaterTest
{
  [Fact]
  public void CreateValidWater()
  {
    var expected = new {
      Date = DateTime.Now,
      Temperature = 30,
      DissolvedOxygen = 30.6f,
      PH = (byte)14,
    };

    var current = WaterEntity.Of(
      expected.Date,
      expected.Temperature,
      expected.DissolvedOxygen,
      PH.Of(expected.PH).Unwrap()
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.Date, current.Date);
    Assert.Equal(expected.Temperature, current.Temperature);
    Assert.Equal(expected.PH, current.PH.Value);
    Assert.Equal(expected.DissolvedOxygen, current.DissolvedOxygen);
  }
}
