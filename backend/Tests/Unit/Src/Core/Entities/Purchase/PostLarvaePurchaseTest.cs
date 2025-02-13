using Aquadata.Core.Entities.Purchase;


namespace Aquadata.UnitTests.Core.Entities.Purchase;

public class PostLarvaePurchaseTest
{
  [Fact]
  public void CreateValidPostLarvaePurchase()
  {
    var expected = new {
      Date = "03/12/2024",
      Label =  "CELM",
      Quantity = 22,
      Value = 35.6m
    };

    var current = PostLarvaePurchaseEntity.Of(
      expected.Date,
      expected.Label,
      expected.Quantity,
      expected.Value
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.Date, current.Date.ToString());
    Assert.Equal(expected.Label, current.Label);
    Assert.Equal(expected.Quantity, current.Quantity);
    Assert.Equal(expected.Value, current.Value);
  }

}
