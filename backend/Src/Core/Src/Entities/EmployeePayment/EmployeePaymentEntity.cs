using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.Entities.EmployeePayment;

public class EmployeePaymentEntity : Entity
{
  public DateOnly Date {get; private set;}
  public decimal Value {get; private set;}
  public virtual Guid EmployeeId {get;set;}
  public virtual Guid FinancialId {get;set;}
  
  private EmployeePaymentEntity(){}

  private EmployeePaymentEntity(DateOnly date, decimal value)
  {
    Date = date;
    Value = value;
  }

  public static Result<EmployeePaymentEntity> Of(string date, 
  decimal value)
  {
    DateOnly parsedDate;
    var isValidDate = DateOnly.TryParse(date, out parsedDate);
    if (!isValidDate)
      return Result<EmployeePaymentEntity>.Fail(
        Error.Validation(
          "Core.EmployeePayment",
          "Invalid date format"
      ));

    return Create(new EmployeePaymentEntity(parsedDate, value));
  }
  protected override Result<Entity> Validate()
    => Result<Entity>.Ok(this);
}
