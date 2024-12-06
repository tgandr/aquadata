using Aquadata.Core.Entities.Expense;

namespace Aquadata.UnitTests.Core.Entities.Expense;

public class ExpenseTest
{
  [Fact]
  public void CreateValidExpense()
  {
    var expected = new {
      Date = DateOnly.Parse("2024-12-06"),
      Description = "some description",
      CostsPerPond = new List<CostPerPond>{
        new CostPerPond(Guid.NewGuid(), 10m),
        new CostPerPond(Guid.NewGuid(), 10m)
      }
    };

    var current = ExpenseEntity.Of(
      expected.Date,
      expected.Description,
      expected.CostsPerPond
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.Date, current.Date);
    Assert.Equal(expected.Description, current.Description);
    Assert.NotEmpty(current.CostsPerPond);
  }

  [Fact]
  public void TotalMethodTest()
  {
    var expected = new {
      Date = DateOnly.Parse("2024-12-06"),
      Description = "some description",
      CostsPerPond = new List<CostPerPond>{
        new CostPerPond(Guid.NewGuid(), 10.5m),
        new CostPerPond(Guid.NewGuid(), 10.5m)
      }
    };

    var current = ExpenseEntity.Of(
      expected.Date,
      expected.Description,
      expected.CostsPerPond
    ).Unwrap();

    Assert.Equal(21m, current.Total());
  }
}
