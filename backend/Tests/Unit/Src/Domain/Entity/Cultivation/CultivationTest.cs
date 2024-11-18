using Aquadata.Core.Entity.Cultivation;

namespace Aquadata.UnitTests.Domain.Entity.Cultivation;

public class CultivationTest
{
  [Fact]
  public void CreateValidCultivation()
  {
    var expected = new {
      Number = 1,
      Stock = 12000,
      PLOrigin = "example",
      Uniformity = "good",
      SettlementDate = DateTime.Now
    };

    var current = CultivationEntity.Of(
      number: expected.Number,
      stock: expected.Stock,
      pLOrigin: expected.PLOrigin,
      uniformity: expected.Uniformity,
      settlementDate: expected.SettlementDate
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.Number, current.Number);
    Assert.Equal(expected.PLOrigin, current.PLOrigin);
    Assert.Equal(expected.Stock, current.Stock);
    Assert.Equal(expected.Uniformity, current.Uniformity);
    Assert.Equal(expected.SettlementDate, current.SettlementDate);
  }

  [Fact]
  public void HasShrimpMethodTest()
  {
    var cultivation = new {
      withStock = GetCultivation.Valid(),
      withNoStock = GetCultivation.WithNoStock()
    };

    Assert.True(cultivation.withStock.HasShrimp());
    Assert.False(cultivation.withNoStock.HasShrimp());
  }
}
