using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.UnitTests.Core.Util;

public class ResultTest
{
  [Fact]
  public void CreateValidResult()
  {
    var expectedResult = 3;

    var result = Result<int>.Ok(expectedResult);

    Assert.False(result.IsFail);
    Assert.Equal(result.Unwrap(), expectedResult);
  }

  [Fact]
  public void GivenErrorWhenUnwrapThrowException()
  {
    var expectedException = new Exception("Cannot unwrap a fail result");
    var result = Result<object>.Fail(
      Error.Internal(
        "Core.Internal",
        "Cannot unwrap a fail result"
      )
    );

    Assert.Throws<Exception>(() => {
      result.Unwrap();
    });

    Assert.Equal(expectedException.Message, result.Error!.Description);
  }
}
