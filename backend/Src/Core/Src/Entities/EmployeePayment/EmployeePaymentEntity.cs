using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.EmployeePayment;

public class EmployeePaymentEntity : SeedWork.Entity
{
  public DateOnly Date {get;}
  public decimal Value {get;}
  public virtual Guid EmployeeId {get;set;}

  private EmployeePaymentEntity(DateOnly date, decimal value)
  {
    Date = date;
    Value = value;
  }

  public static Result<EmployeePaymentEntity, ModelValidationException> Of(
    DateOnly date, decimal value
  ) => Create(new EmployeePaymentEntity(date, value));
  protected override Result<ModelValidationException> Validate()
    => Result<ModelValidationException>.Ok();
}
