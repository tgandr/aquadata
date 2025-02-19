using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Expense;

public class CostPerPondEntity: Entity
{
  public decimal Value {get; private set;}
  public virtual Guid PondId {get; set;}
  public virtual Guid ExpenseId {get;set;}

  private CostPerPondEntity(decimal value)
  {
    Value = value;
  }
  
  private CostPerPondEntity() {}
  public static Result<CostPerPondEntity> Of(decimal value)
    => Create(new CostPerPondEntity(value));

  protected override Result<Entity> Validate()
    => Result<Entity>.Ok(this);
}
