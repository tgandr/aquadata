using Aquadata.Core.Entities.Expense;

namespace Aquadata.Application.Dtos;

public class CostPerPondDto
{
  public decimal Value {get;}
  public Guid PondId {get;}

  public CostPerPondDto(decimal value, Guid pondId)
  {
    Value = value;
    PondId = pondId;
  }

  public static CostPerPondDto FromEntity(CostPerPondEntity entity)
  => new(entity.Value, entity.PondId);


  public CostPerPondEntity ToEntity(Guid expenseId)
  {
    var cost = CostPerPondEntity.Of(
      Value
    ).Unwrap();

    cost.ExpenseId = expenseId;
    cost.PondId = PondId;

    return cost;
  }
  
}
