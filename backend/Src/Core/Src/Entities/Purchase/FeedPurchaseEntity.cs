using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Purchase;

public class FeedPurchaseEntity : PurchaseBase
{
  public string Brand {get; private set;}
  public DateOnly Validity {get; private set;}
  public int BagSize {get; private set;}
  public string RationType {get; private set;}

  private FeedPurchaseEntity()
  :base(DateOnly.MinValue,"",0,0) {}
  
  private FeedPurchaseEntity(DateOnly date, string label, string brand,
  int quantity, decimal value, DateOnly validity, 
  int bagSize, string rationType) 
  : base(date, label, quantity, value)
  {
    Brand = brand;
    Validity = validity;
    BagSize = bagSize;
    RationType = rationType;
  }

  public static Result<FeedPurchaseEntity> Of(
    DateOnly date, string label, string brand,
    int quantity, decimal value, DateOnly validity, 
    int bagSize, string rationType
  ) => Create(new FeedPurchaseEntity(date,label,brand,quantity,value,
    validity,bagSize,rationType)); 
  

}
