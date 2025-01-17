using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Expense;

public class ExpenseEntity : SeedWork.Entity
{
  public DateOnly Date {get; private set;}
  public string Description {get; private set;}
  public ICollection<CostPerPondEntity> CostsPerPond {get; set;}

  public virtual Guid UserId {get;set;}

  private ExpenseEntity() {}
  private ExpenseEntity(DateOnly date, string description, 
  ICollection<CostPerPondEntity> costsPerPond): base()
  {
    Date = date;
    Description = description;
    CostsPerPond = costsPerPond;
  }

  public decimal Total()
    => CostsPerPond.Sum(c => c.Value);

  public static Result<ExpenseEntity> Of(
    DateOnly date, string description, ICollection<CostPerPondEntity> costsPerPond
  ) => Create(new ExpenseEntity(date,description,costsPerPond));

  protected override Result<Entity> Validate()
  {
    return Result<Entity>.Ok(this);
  }
  
}
