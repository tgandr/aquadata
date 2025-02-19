using Aquadata.Core.Enums;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

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

  public static Result<FertilizerPurchaseEntity> Of(string date, 
  string label, int quantity, decimal value,MeasureUnit unit)
  {
    DateOnly parsedDate;
    var isValidDate = DateOnly.TryParse(date, out parsedDate);
    if (!isValidDate)
      return Result<FertilizerPurchaseEntity>.Fail(
        Error.Validation(
          "Core.FertilizerPurchase",
          "Invalid date format"
    ));
    return Create(new FertilizerPurchaseEntity(parsedDate,
    label,quantity,value,unit)); 
  }

}
