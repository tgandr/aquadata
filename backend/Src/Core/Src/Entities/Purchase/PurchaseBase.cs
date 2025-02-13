using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Purchase;

public abstract class PurchaseBase : Entity
{
  public DateOnly Date {get; private set;}
  public string Label {get; private set;}
  public int Quantity {get; private set;}
  public decimal Value {get; private set;}

  public Guid UserId {get; set;}

  protected PurchaseBase(DateOnly date, string label, int quantity, decimal value)
  :base()
  {
    Date = date;
    Label = label;
    Quantity = int.Abs(quantity);
    Value = decimal.Abs(value);
  }
  
  protected override Result<Entity> Validate()
    => Result<Entity>.Ok(this);    
  
}
