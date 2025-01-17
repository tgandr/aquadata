using Aquadata.Core.Entities.EmployeePayment;

namespace Aquadata.UnitTests.Core.Entities.Payroll;

public class EmployeePaymentTest
{
  [Fact]
  public void CreateValidEmployeePayment()
  {
    var expected = new {
      Date = DateOnly.Parse("01-12-2024"),
      Value = 2000m
    };

    var current = EmployeePaymentEntity.Of(
      expected.Date,
      expected.Value
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.Date, current.Date);
    Assert.Equal(expected.Value, current.Value);
  }
}
