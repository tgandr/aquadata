using Aquadata.Core.Enums;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Purchase;

public class FertilizerPurchaseEntity : PurchaseBase
{
  public MeasureUnit Unit {get; private set;}

  private FertilizerPurchaseEntity()
  :base(DateOnly.MinValue,"",0,0) {}
  

  private FertilizerPurchaseEntity(DateOnly date, string label, int quantity, decimal value,
  MeasureUnit unit) 
  : base(date, label, quantity, value)
  {
    Unit = unit;
  }

  public static Result<FertilizerPurchaseEntity> Of(
    DateOnly date, string label, int quantity, decimal value,MeasureUnit unit
  ) => Create(new FertilizerPurchaseEntity(date,label,quantity,value,unit)); 

}
