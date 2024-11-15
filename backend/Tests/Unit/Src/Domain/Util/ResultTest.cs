using Aquadata.Core.Util;

namespace Aquadata.UnitTests.Domain.Util;

public class ResultTest
{
  [Fact]
  public void CreateValidResult()
  {
    var expectedResult = 3;

    var result = Result<int, Exception>.Ok(expectedResult);

    Assert.False(result.IsFail);
    Assert.Equal(result.Unwrap(), expectedResult);
  }

  [Fact]
  public void GivenErrorWhenUnwrapThrowException()
  {
    var expectedException = new Exception("exception Message");
    var result = Result<Exception>.Fail(expectedException);

    Assert.Throws<Exception>(() => {
      result.Unwrap();
    });

    Assert.Equal(expectedException.Message, result.Error!.Message);
  }

  [Fact] 
  public void GivenEmptyResultWhenUnwrapThrowException()
  {
    var emptyResult = Result<Exception>.Ok();
    var resultWithType = Result<int, Exception>.Ok();

    Assert.Throws<Exception>(() => {
      emptyResult.Unwrap();
    });

    Assert.Throws<Exception>(() => {
      resultWithType.Unwrap();
    });
  }

  [Fact]
  public void GivenEmptyFailResultWhenUnwrapThrowError()
  {
    var emptyResult = Result<Exception>.Fail(new Exception("exception message"));
    var resultWithType = Result<int, Exception>.Fail(new Exception("exception message"));

    Assert.Throws<Exception>(() => {
      emptyResult.Unwrap();
    });

    Assert.Throws<Exception>(() => {
      resultWithType.Unwrap();
    });
  }

  [Fact]
  public void IfOkReturnMethodTest()
  {
    var okResult = Result<Exception>.Ok();
    var failResult = Result<Exception>.Fail(new Exception());
    var expectedResult = "test";

    Assert.Equal(expectedResult, okResult.IfOkReturn("test").Unwrap());
    Assert.Throws<Exception>(() => {
      failResult.IfOkReturn("test").Unwrap();
    });

  }
}
