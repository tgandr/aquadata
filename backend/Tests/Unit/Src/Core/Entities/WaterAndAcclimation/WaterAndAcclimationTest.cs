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
      PH = (byte)3,
      Salinity = 3,
      ammonia = 54.5f,
      Nitrite = 43.6f,
      Origin = WaterAndAcclimationOrigin.Pond
    };

    var current = WaterAndAcclimationEntity.Of(
      expected.Oxygen,
      expected.Temperature,
      expected.PH,
      expected.Salinity,
      expected.ammonia,
      expected.Nitrite,
      expected.Origin
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.Oxygen, current.Oxygen);
    Assert.Equal(expected.Temperature, current.Temperature);
    Assert.Equal(expected.PH, current.PH.Value);
    Assert.Equal(expected.ammonia, current.Ammonia);
    Assert.Equal(expected.Salinity, current.Salinity);
    Assert.Equal(expected.Nitrite, current.Nitrite);
    Assert.Equal(expected.Origin, current.Origin);
  }
}
