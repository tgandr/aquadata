
using Aquadata.Core.ValueObjects;

namespace Aquadata.UnitTests.ValueObject;

public class PHTest
{
  [Fact]
  public void CreateValidTest()
  {
    var expected = new
    {
        Value = (byte)5
    };

    var current = PH.Of(expected.Value).Unwrap();

    Assert.NotNull(current);
    Assert.Equal(expected.Value, current.Value);
  }
}
