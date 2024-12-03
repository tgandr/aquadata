using Aquadata.Core.Enums;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Purchase;

public class ProbioticsPurchaseEntity : PurchaseBase
{
  public MeasureUnit Unit {get;}

  private ProbioticsPurchaseEntity(DateOnly date, 
  string label, int quantity, decimal value, MeasureUnit unit)
  :base(date,label,quantity,value)
  {
    Unit = unit;
  }

  public static Result<ProbioticsPurchaseEntity, ModelValidationException> Of(
    DateOnly date, string label, int quantity, decimal value, MeasureUnit unit
  ) => Create(new ProbioticsPurchaseEntity(date,label,quantity,value,unit));

}
