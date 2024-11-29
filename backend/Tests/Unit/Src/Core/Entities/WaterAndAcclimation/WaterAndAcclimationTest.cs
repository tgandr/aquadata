using Aquadata.Core.Entities.WaterAndAcclimation;
using Aquadata.Core.Enums;
using Aquadata.Core.ValueObjects;

namespace Aquadata.UnitTests.Core.Entities.WaterAndAcclimation;

public class WaterAndAcclimationTest
{
  [Fact]
  public void CreateValidWaterAndAcclimation()
  {
    var expected = new {
      Oxygen = 3.5f,
      Temperature = 24,
      PH = PH.Of(2).Unwrap(),
      Salinity = 3,
      Ammonium = 54.5f,
      Nitrite = 43.6f,
      Origin = WaterAndAcclimationOrigin.Pond
    };

    var current = WaterAndAcclimationEntity.Of(
      expected.Oxygen,
      expected.Temperature,
      expected.PH,
      expected.Salinity,
      expected.Ammonium,
      expected.Nitrite,
      expected.Origin
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.Oxygen, current.Oxygen);
    Assert.Equal(expected.Temperature, current.Temperature);
    Assert.Equal(expected.PH, current.PH);
    Assert.Equal(expected.Ammonium, current.Ammonium);
    Assert.Equal(expected.Salinity, current.Salinity);
    Assert.Equal(expected.Nitrite, current.Nitrite);
    Assert.Equal(expected.Origin, current.Origin);
  }
}
