
using CoreEntity = Aquadata.Core.Entities.Pond;
namespace Aquadata.UnitTests.Core.Entities.Pond;

public class PondTest
{
  [Fact]
  public void CreateValidPond()
  {
    var expected = new {
      Name = "name",
      Area = 10.5f,
      IsActive = true
    };

    var pond = CoreEntity
      .PondEntity.Of(
        expected.Name,
        expected.Area,
        expected.IsActive
      ).Unwrap();

    Assert.NotNull(pond);
    Assert.NotEqual(pond.Id, default);
    Assert.Equal(expected.Name, pond.Name);
    Assert.Equal(expected.Area, pond.Area);
    Assert.Equal(expected.IsActive, pond.IsActive);
  }
}
