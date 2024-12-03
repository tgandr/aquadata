using Aquadata.Core.Entities.Purchase;

namespace Aquadata.UnitTests.Core.Entities.Purchase;

public class FeedPurchaseTest
{
  [Fact]
  public void CreateValidFeedPurchase()
  {
    var expected = new {
      Date = DateOnly.Parse("2024-12-12"),
      Label =  "CELM",
      Quantity = 22,
      Value = 35.6m,
      Validity = DateOnly.Parse("2024-12-24"),
      BagSize = 25,
      RationType = "2mm"
    };

    var current = FeedPurchaseEntity.Of(
      expected.Date,
      expected.Label,
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
    Assert.Equal(expected.Date, current.Date);
    Assert.Equal(expected.Label, current.Label);
    Assert.Equal(expected.Quantity, current.Quantity);
    Assert.Equal(expected.Value, current.Value);
    Assert.Equal(expected.Validity, current.Validity);
    Assert.Equal(expected.BagSize, current.BagSize);
    Assert.Equal(expected.RationType, current.RationType);
  }
}
