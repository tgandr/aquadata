using Aquadata.Core.Enums;
using Aquadata.Core.Util;

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

  public static Result<ProbioticsPurchaseEntity> Of(
    DateOnly date, string label, int quantity, decimal value, MeasureUnit unit
  ) => Create(new ProbioticsPurchaseEntity(date,label,quantity,value,unit));

}
