using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Errors;

namespace Aquadata.UnitTests.Core.Entities.Purchase;

public class PostLarvaePurchaseTest
{
  [Fact]
  public void CreateValidPostLarvaePurchase()
  {
    var expected = new {
      Date = DateOnly.Parse("2024-12-03"),
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
    Assert.Equal(expected.Date, current.Date);
    Assert.Equal(expected.Label, current.Label);
    Assert.Equal(expected.Quantity, current.Quantity);
    Assert.Equal(expected.Value, current.Value);
  }

}
