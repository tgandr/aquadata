using Aquadata.Core.Errors;
using CoreEntity = Aquadata.Core.Entity.Pond;
namespace Aquadata.UnitTests.Domain.Entity.Pond;

public class PondTest
{
  [Fact]
  public void CreateValidPond()
  {
    var expected = new {
      Name = "name",
      Area = 10.5f
    };

    var pond = CoreEntity
      .PondEntity.Of(
        expected.Name,
        expected.Area
      ).Unwrap();

    Assert.NotNull(pond);
    Assert.NotEqual(pond.Id, default);
    Assert.Equal(expected.Name, pond.Name);
    Assert.Equal(expected.Area, pond.Area);
  }

  [Fact]
  public void GivenInvalidParamsWhenCreateThrowError()
  {
    var pond = new {
      withInvalidName = GetPond.WithInvalidName(),
      withInvalidArea = GetPond.WithInvalidArea()
    };

    Assert.Throws<EntityValidationException>(() => {
      pond.withInvalidName.Unwrap();
    });
    
    Assert.Throws<EntityValidationException>(() => {
      pond.withInvalidArea.Unwrap();
    });
  }
}
