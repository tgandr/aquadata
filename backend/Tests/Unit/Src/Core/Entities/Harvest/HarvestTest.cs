using Aquadata.Core.Entities.Harvest;
using Aquadata.Core.Errors;

namespace Aquadata.UnitTests.Core.Entities.Harvest;

public class HarvestTest
{
  [Fact]
  public void CreateValidHarvest()
  {
    var expected = new {
      Buyer = "buyer",
      Price = 4000.50m,
      Date = DateTime.Now,
      IsTotal = true,
      BioMass = 24.5f
    };

    var current = HarvestEntity.Of(
      expected.Buyer,
      expected.Price,
      expected.Date,
      expected.IsTotal,
      expected.BioMass
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.Buyer, current.Buyer);
    Assert.Equal(expected.Price, current.Price);
    Assert.Equal(expected.Date, current.Date);
    Assert.Equal(expected.IsTotal, current.IsTotal);
    Assert.Equal(expected.BioMass, current.BioMass);
  }

  [Fact]
  public void GivenInvalidParamsWhenCreateThrowException()
  {
    var invalid = HarvestEntity.Of("", 10, DateTime.Now, false, 10);

    Assert.Throws<ModelValidationException>(() => {
      invalid.Unwrap();
    });
  }
}
