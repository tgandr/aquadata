using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Purchase;

public abstract class PurchaseBase : SeedWork.Entity
{
  public DateOnly Date {get;}
  public string Label {get;}
  public int Quantity {get;}
  public decimal Value {get;}

  protected PurchaseBase(DateOnly date, string label, int quantity, decimal value)
  :base()
  {
    Date = date;
    Label = label;
    Quantity = int.Abs(quantity);
    Value = decimal.Abs(value);
  }

  protected override Result<ModelValidationException> Validate()
    => Result<ModelValidationException>.Ok();    
  
}
