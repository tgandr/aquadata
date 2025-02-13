using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.Entities.Expense;

public class ExpenseEntity : Entity
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

  public static Result<ExpenseEntity> Of(string date, 
  string description, ICollection<CostPerPondEntity> costsPerPond)
  {
    DateOnly parsedDate;
    var isValidDate = DateOnly.TryParse(date, out parsedDate);
    if (!isValidDate)
      return Result<ExpenseEntity>.Fail(
        Error.Validation(
          "Core.Expense",
          "Invalid date format"
    ));
    return Create(new ExpenseEntity(parsedDate,description,costsPerPond));
  }

  protected override Result<Entity> Validate()
  {
    return Result<Entity>.Ok(this);
  }
  
}
