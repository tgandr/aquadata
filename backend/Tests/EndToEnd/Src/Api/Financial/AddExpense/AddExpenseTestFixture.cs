using Aquadata.Application.Dtos;
using Aquadata.Core.Entities.Pond;
using Aquadata.EndToEndTests.Api.User.Common;
using Aquadata.EndToEndTests.Api.Financial.Common;

namespace Aquadata.EndToEndTests.Api.Financial.AddExpense;

[CollectionDefinition(nameof(AddExpenseTestFixture))]
public class AddExpenseTestFixture
:FinancialFixture, ICollectionFixture<AddExpenseTestFixture>
{
  public PondEntity GetPondExample(Guid userId)
  {
    var pond = PondEntity.Of("name", 23f).Unwrap();
    pond.UserId = userId;

    return pond;
  }

  public ExpenseDto GetInput(Guid pondId)
  {
    var costs = new List<CostPerPondDto>{
      new CostPerPondDto(2m, pondId),
      new CostPerPondDto(3.4m, pondId),
      new CostPerPondDto(10.8m, pondId),
    };

    var expense = new ExpenseDto(
      "12/12/2022",
      "description",
      costs
    );

    return expense;
  }
}
