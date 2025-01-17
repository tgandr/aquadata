using Aquadata.Core.Entities.Purchase;


namespace Aquadata.UnitTests.Core.Entities.Purchase;

public class GenericPurchaseTest
{
  [Fact]
  public void CreateValidGenericPurchase()
  {
    var expected = new {
      Date = DateOnly.Parse("2024-12-12"),
      Label =  "CELM",
      Quantity = 22,
      Value = 35.6m,
      Description = "description"
    };

    var current = GenericPurchaseEntity.Of(
      expected.Date,
      expected.Label,
      expected.Quantity,
      expected.Value,
      expected.Description
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.NotEqual(current.CreatedAt, default);
    Assert.NotEqual(current.UpdatedAt, default);
    Assert.Equal(expected.Date, current.Date);
    Assert.Equal(expected.Label, current.Label);
    Assert.Equal(expected.Quantity, current.Quantity);
    Assert.Equal(expected.Value, current.Value);
  }
}
