using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.EmployeePayment;

public class EmployeePaymentEntity : SeedWork.Entity
{
  public DateOnly Date {get; private set;}
  public decimal Value {get; private set;}
  public virtual Guid EmployeeId {get;set;}
  
  private EmployeePaymentEntity(){}

  private EmployeePaymentEntity(DateOnly date, decimal value)
  {
    Date = date;
    Value = value;
  }

  public static Result<EmployeePaymentEntity> Of(
    DateOnly date, decimal value
  ) => Create(new EmployeePaymentEntity(date, value));

  protected override Result<Entity> Validate()
    => Result<Entity>.Ok(this);
}
