using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Enums;

namespace Aquadata.UnitTests.Core.Entities.Purchase;

public class ProbioticsPurchaseTest
{
  [Fact]
  public void CreateValidProbioticPurchase()
  {
    var expected = new {
      Date = "23/03/2024",
      Label = "BioTrends",
      Quantity = 22,
      Value = 10.5m,
      Unit = MeasureUnit.Kg
    };

    var current = ProbioticsPurchaseEntity.Of(
      expected.Date,
      expected.Label,
      expected.Quantity,
      expected.Value,
      expected.Unit
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.Quantity, current.Quantity);
    Assert.Equal(expected.Value, current.Value);
    Assert.Equal(expected.Unit, current.Unit);
    Assert.Equal(expected.Label, current.Label);
    Assert.Equal(expected.Date, current.Date.ToString());
  }
}
