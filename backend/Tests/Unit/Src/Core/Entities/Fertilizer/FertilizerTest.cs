using Aquadata.Core.Entities.Fertilizer;

using Aquadata.Core.Enums;

namespace Aquadata.UnitTests.Core.Entities.Fertilizer;

public class FertilizerTest
{
  [Fact]
  public void CreateValidFertilizer()
  {
    var expected = new {
      Name = "Fertilizer",
      Date = DateTime.Now,
      Type = FertilizerType.Probiotic,
      Quantity = 10,
      MeasureUnit = MeasureUnit.Kg,
    };

    var current = FertilizerEntity.Of(
      expected.Name,
      expected.Date,
      expected.Type,
      expected.Quantity,
      expected.MeasureUnit
    ).Unwrap();


    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.Name, current.Name);
    Assert.Equal(expected.Date, current.Date);
    Assert.Equal(expected.Type, current.Type);
    Assert.Equal(expected.Quantity, current.Quantity);
    Assert.Equal(expected.MeasureUnit, current.MeasureUnit);
  }

}
