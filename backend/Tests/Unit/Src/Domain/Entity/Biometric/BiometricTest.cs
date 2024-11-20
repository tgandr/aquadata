using Aquadata.Core.Entity.Biometric;

namespace Aquadata.UnitTests.Domain.Entity.Biometric;

public class BiometricTest
{
  [Fact]
  public void CreateValidBiometric()
  {
    var expected = new {
      Count = 200.5f,
      AverageWeight = 35.7f,
      Date = DateTime.Now,
    };

    var current = BiometricEntity.Of(
      count: expected.Count,
      averageWeight: expected.AverageWeight,
      date: expected.Date
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.Count, current.Count);
    Assert.Equal(expected.AverageWeight, current.AverageWeight);
    Assert.Equal(expected.Date, current.Date);
  }
}
