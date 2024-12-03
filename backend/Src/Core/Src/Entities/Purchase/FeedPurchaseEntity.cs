using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Purchase;

public class FeedPurchaseEntity : PurchaseBase
{
  public DateOnly Validity {get;}
  public int BagSize {get;}
  public string RationType {get;}
  private FeedPurchaseEntity(DateOnly date, string label, 
  int quantity, decimal value, DateOnly validity, 
  int bagSize, string rationType) 
  : base(date, label, quantity, value)
  {
    Validity = validity;
    BagSize = bagSize;
    RationType = rationType;
  }

  public static Result<FeedPurchaseEntity,ModelValidationException> Of(
    DateOnly date, string label, 
    int quantity, decimal value, DateOnly validity, 
    int bagSize, string rationType
  ) => Create(new FeedPurchaseEntity(date,label,quantity,value,
    validity,bagSize,rationType)); 
  

}
