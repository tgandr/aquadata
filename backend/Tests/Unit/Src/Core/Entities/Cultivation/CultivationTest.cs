using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Enums;


namespace Aquadata.UnitTests.Core.Entities.Cultivation;

public class CultivationTest
{
  [Fact]
  public void CreateValidCultivation()
  {
  
    var expected = new {
      PondNumber = 1,
      Stock = 12000,
      PLOrigin = "example",
      Uniformity = CultivationUniformity.Good,
      WaterAndAcclimationChecked = false,
      SettlementDate = DateTime.Now,
    };

    var current = CultivationEntity.Of(
      pondNumber: expected.PondNumber,
      stock: expected.Stock,
      pLOrigin: expected.PLOrigin,
      uniformity: expected.Uniformity,
      waterAndAcclimationChecked: expected.WaterAndAcclimationChecked,
      settlementDate: expected.SettlementDate
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.PondNumber, current.PondNumber);
    Assert.Equal(expected.PLOrigin, current.PLOrigin);
    Assert.Equal(expected.Stock, current.Stock);
    Assert.Equal(expected.Uniformity, current.Uniformity);
    Assert.Equal(expected.SettlementDate, current.SettlementDate);
    Assert.Equal(expected.WaterAndAcclimationChecked, current.WaterAndAcclimationChecked);
  }


  [Fact]
  public void HasShrimpMethodTest()
  {
    var cultivation = new {
      withStock = GetCultivation.Valid(),
      WithInvalidStock = GetCultivation.WithInvalidStock()
    };

    Assert.True(cultivation.withStock.HasShrimp());
    Assert.False(cultivation.WithInvalidStock.HasShrimp());
  }
}
