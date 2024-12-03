
using Aquadata.Core.Enums;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Purchase;

public class FertilizerPurchaseEntity : PurchaseBase
{
  public string Name {get;}
  public MeasureUnit Unit {get;}

  private FertilizerPurchaseEntity(DateOnly date, string label, int quantity, decimal value, 
  string name, MeasureUnit unit) 
  : base(date, label, quantity, value)
  {
    Name = name;
    Unit = unit;
  }

  public static Result<FertilizerPurchaseEntity, ModelValidationException> Of(
    DateOnly date, string label, int quantity, decimal value, 
    string name, MeasureUnit unit
  ) => Create(new FertilizerPurchaseEntity(date,label,quantity,value,name,unit)); 

}
