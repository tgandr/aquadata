using Aquadata.Core.Entities.Purchase;

namespace Aquadata.UnitTests.Core.Entities.Purchase;

public class FeedPurchaseTest
{
  [Fact]
  public void CreateValidFeedPurchase()
  {
    var expected = new {
      Date = "12/12/2024",
      Label =  "CELM",
      Brand = "Poli Nutri",
      Quantity = 22,
      Value = 35.6m,
      Validity = "23/12/2024",
      BagSize = 25,
      RationType = "2mm"
    };

    var current = FeedPurchaseEntity.Of(
      expected.Date,
      expected.Label,
      expected.Brand,
      expected.Quantity,
      expected.Value,
      expected.Validity,
      expected.BagSize,
      expected.RationType
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.NotEqual(current.CreatedAt, default);
    Assert.NotEqual(current.UpdatedAt, default);
    Assert.Equal(expected.Date, current.Date.ToString());
    Assert.Equal(expected.Label, current.Label);
    Assert.Equal(expected.Brand, current.Brand);
    Assert.Equal(expected.Quantity, current.Quantity);
    Assert.Equal(expected.Value, current.Value);
    Assert.Equal(expected.Validity, current.Validity.ToString());
    Assert.Equal(expected.BagSize, current.BagSize);
    Assert.Equal(expected.RationType, current.RationType);
  }
}
