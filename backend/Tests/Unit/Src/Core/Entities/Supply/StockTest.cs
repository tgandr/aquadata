using Aquadata.Core.Entities.Stock;
using Aquadata.Core.Enums;


namespace Aquadata.UnitTests.Core.Entities.Supply;

public class SupplyTest
{
  [Fact]
  public void CreateValidStock()
  {
    var expected = new {
      Label = "Label",
      SupplyType = SupplyType.Ration,
      Quantity = 100,
    };

    var current = StockEntity.Of(
      expected.Label,
      expected.SupplyType,
      expected.Quantity
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.Label, current.Label);
    Assert.Equal(expected.SupplyType, current.SupplyType);
    Assert.Equal(expected.Quantity, current.Quantity);
  }
}
