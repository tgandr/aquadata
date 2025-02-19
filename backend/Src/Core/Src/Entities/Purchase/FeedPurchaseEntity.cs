using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

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
  string date, string label, string brand,
  int quantity, decimal value, string validity, 
  int bagSize, string rationType)
  {
    DateOnly parsedDate;
    DateOnly parsedValidity;
    var isValidDate = DateOnly.TryParse(date, out parsedDate);
    var isValidValidity = DateOnly.TryParse(validity, out parsedValidity);

    if (!isValidDate || !isValidValidity)
      return Result<FeedPurchaseEntity>.Fail(
        Error.Validation(
          "Core.FeedPurchase",
          "Invalid date format"
      ));

    return Create(new FeedPurchaseEntity(
      parsedDate,label,brand,quantity,
      value,parsedValidity, bagSize, 
      rationType
    ));
  } 
  

}
