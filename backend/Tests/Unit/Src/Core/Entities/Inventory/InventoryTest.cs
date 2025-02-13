using Aquadata.Core.Entities.Inventory;
using Aquadata.Core.Enums;

namespace Aquadata.UnitTests.Core.Entities.Inventory;

public class InventoryTest
{
  [Fact]
  public void CreateValidInventory()
  {
    var expected = new {
      ItemName = "name",
      AmountInvested = 2000m,
      FinalValue = 2000m,
      UsefulLifeInYears = 5,
      Status = ItemStatus.New,
      InOperationSince = "31/08/2024"
    };

    var current = InventoryEntity.Of(
      expected.ItemName,
      expected.AmountInvested,
      expected.FinalValue,
      expected.UsefulLifeInYears,
      expected.Status,
      expected.InOperationSince
    ).Unwrap();

    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.ItemName, current.ItemName);
    Assert.Equal(expected.AmountInvested, current.AmountInvested);
    Assert.Equal(expected.FinalValue, current.FinalValue);
    Assert.Equal(expected.Status, current.Status);
    Assert.Equal(expected.UsefulLifeInYears, current.UsefulLifeInYears);
    Assert.Equal(expected.InOperationSince, current.InOperationSince.ToString());
  }
}
