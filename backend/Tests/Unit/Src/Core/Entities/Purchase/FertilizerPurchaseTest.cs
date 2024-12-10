using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Enums;

namespace Aquadata.UnitTests.Core.Entities.Purchase;

public class FertilizerPurchaseTest
{
  [Fact]
  public void CreateValidFertilizerPurchase()
  {
    var expected = new {
      Date = DateOnly.Parse("2024-12-03"),
      Label =  "CELM",
      Quantity = 22,
      Value = 35.6m,
      Brand = "Fertilizer",
      Unit = MeasureUnit.L
    };

    var current = FertilizerPurchaseEntity.Of(
      expected.Date,
      expected.Label,
      expected.Quantity,
      expected.Value,
      expected.Brand,
      expected.Unit
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.NotEqual(current.CreatedAt, default);
    Assert.NotEqual(current.UpdatedAt, default);
    Assert.Equal(expected.Date, current.Date);
    Assert.Equal(expected.Label, current.Label);
    Assert.Equal(expected.Quantity, current.Quantity);
    Assert.Equal(expected.Value, current.Value);
    Assert.Equal(expected.Brand, current.Brand);
    Assert.Equal(expected.Unit, current.Unit);
  }
}
