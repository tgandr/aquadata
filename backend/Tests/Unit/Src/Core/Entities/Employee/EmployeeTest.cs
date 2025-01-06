using Aquadata.Core.Entities.Employee;


namespace Aquadata.UnitTests.Core.Entities.Employee;

public class EmployeeTest
{
  [Fact]
  public void CreateValidEmployee()
  {
    var expected = new {
      Name = "Valid name"
    };

    var current = EmployeeEntity.Of(
      expected.Name
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.Name, current.Name);
  }
}
