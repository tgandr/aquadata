using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Expense;

public class ExpenseEntity : SeedWork.Entity
{
  public DateOnly Date {get;}
  public string Description {get;}
  public ICollection<CostPerPond> CostsPerPond {get;}

  private ExpenseEntity(DateOnly date, string description, 
  ICollection<CostPerPond> costsPerPond): base()
  {
    Date = date;
    Description = description;
    CostsPerPond = costsPerPond;
  }

  public static Result<ExpenseEntity, ModelValidationException> Of(
    DateOnly date, string description, ICollection<CostPerPond> costsPerPond
  ) => Create(new ExpenseEntity(date,description,costsPerPond));

  protected override Result<ModelValidationException> Validate()
  {
    return Result<ModelValidationException>.Ok();
  }

  public decimal Total()
    => CostsPerPond.Sum(c => c.Value);
  
}
