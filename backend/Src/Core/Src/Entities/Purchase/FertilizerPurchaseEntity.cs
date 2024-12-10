
using Aquadata.Core.Enums;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Purchase;

public class FertilizerPurchaseEntity : PurchaseBase
{
  public string Brand {get;}
  public MeasureUnit Unit {get;}

  private FertilizerPurchaseEntity(DateOnly date, string label, int quantity, decimal value, 
  string brand, MeasureUnit unit) 
  : base(date, label, quantity, value)
  {
    Brand = brand;
    Unit = unit;
  }

  public static Result<FertilizerPurchaseEntity, ModelValidationException> Of(
    DateOnly date, string label, int quantity, decimal value, 
    string brand, MeasureUnit unit
  ) => Create(new FertilizerPurchaseEntity(date,label,quantity,value,brand,unit)); 

}
