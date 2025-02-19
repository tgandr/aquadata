using Aquadata.Core.Entities.Expense;

namespace Aquadata.UnitTests.Core.Entities.Expense;

public class ExpenseTest
{
  [Fact]
  public void CreateValidExpense()
  {
    var expected = new {
      Date = "12/12/2024",
      Description = "some description",
      CostsPerPond = new List<CostPerPondEntity>{
        CostPerPondEntity.Of(10m).Unwrap(),
        CostPerPondEntity.Of(10m).Unwrap()
      }
    };

    var current = ExpenseEntity.Of(
      expected.Date,
      expected.Description
    ).Unwrap();

    current.CostsPerPond = expected.CostsPerPond;

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.Date, current.Date.ToString());
    Assert.Equal(expected.Description, current.Description);
    Assert.NotEmpty(current.CostsPerPond);
  }

  [Fact]
  public void TotalMethodTest()
  {
    var expected = new {
      Date = "23/02/2024",
      Description = "some description",
      CostsPerPond = new List<CostPerPondEntity>{
        CostPerPondEntity.Of(10.5m).Unwrap(),
        CostPerPondEntity.Of(10.5m).Unwrap()
      }
    };

    var current = ExpenseEntity.Of(
      expected.Date,
      expected.Description
    ).Unwrap();

    current.CostsPerPond = expected.CostsPerPond;

    Assert.Equal(21m, current.Total());
  }
}
