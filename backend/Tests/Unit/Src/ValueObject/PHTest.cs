using Aquadata.Core.Errors;
using Aquadata.Core.ValueObjects;

namespace Unit.Src.ValueObject;

public class PHTest
{
  [Fact]
  public void CreateValidTest()
  {
    var expected = new {
      Value = (byte)5
    };

    var current = PH.Of(expected.Value).Unwrap();

    Assert.NotNull(current);
    Assert.Equal(expected.Value, current.Value);
  }

  [Fact]
  public void GivenInvalidParamsWhenCreatePHThrowError()
  {
 
    var current = PH.Of(20);

    Assert.Throws<ModelValidationException>(() => {
      current.Unwrap();
    });
  }
}
