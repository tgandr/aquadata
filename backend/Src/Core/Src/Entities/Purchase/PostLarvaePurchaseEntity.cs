using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.Entities.Purchase;

public class PostLarvaePurchaseEntity : PurchaseBase
{ 
  public virtual Guid CultivationId {get;set;}
  public virtual CultivationEntity Cultivation {get;set;}

  private PostLarvaePurchaseEntity()
  :base(DateOnly.MinValue,"",0,0) {}
  
  private PostLarvaePurchaseEntity(DateOnly date, string label, int quantity, decimal value)
  :base(date,label,quantity,value){}

  public static Result<PostLarvaePurchaseEntity> Of(
    string date, string label, int quantity, decimal value)
  {
    DateOnly parsedDate;
    var isValidDate = DateOnly.TryParse(date, out parsedDate);
    if (!isValidDate)
      return Result<PostLarvaePurchaseEntity>.Fail(
        Error.Validation(
          "Core.PostLarvaePurchase",
          "Invalid date format"
    ));
    return Create(new PostLarvaePurchaseEntity(
      parsedDate,label,quantity,value));
  }
    
      
}
