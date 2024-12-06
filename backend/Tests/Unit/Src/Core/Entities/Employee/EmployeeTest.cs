using Aquadata.Core.Entities.Employee;
using Aquadata.Core.Errors;

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

  [Fact]
  public void GivenInvalidNameThrowError()
  {
    var expected = new {
      Name = ""
    };

    var current = EmployeeEntity.Of(
      expected.Name
    );

    Assert.Throws<ModelValidationException>(() => {
      current.Unwrap();
    });
  }
}
