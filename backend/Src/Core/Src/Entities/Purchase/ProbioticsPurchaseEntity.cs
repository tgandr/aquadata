using Aquadata.Core.Enums;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.Entities.Purchase;

public class ProbioticsPurchaseEntity : PurchaseBase
{
  public MeasureUnit Unit {get; private set;}

  private ProbioticsPurchaseEntity()
  :base(DateOnly.MinValue,"",0,0) {}
  
  private ProbioticsPurchaseEntity(DateOnly date, 
  string label, int quantity, decimal value, MeasureUnit unit)
  :base(date,label,quantity,value)
  {
    Unit = unit;
  }

  public static Result<ProbioticsPurchaseEntity> Of(string date, 
  string label, int quantity, decimal value, MeasureUnit unit)
  {
    DateOnly parsedDate;
    var isValidDate = DateOnly.TryParse(date, out parsedDate);
    if (!isValidDate)
      return Result<ProbioticsPurchaseEntity>.Fail(
        Error.Validation(
          "Core.ProbioticPurchase",
          "Invalid date format"
    ));
    
    return Create(new ProbioticsPurchaseEntity(parsedDate,label,
    quantity,value,unit));
  }

}
