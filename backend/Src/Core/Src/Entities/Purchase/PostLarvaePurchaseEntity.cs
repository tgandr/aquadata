using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Purchase;

public class PostLarvaePurchaseEntity : PurchaseBase
{
  
  public virtual Guid CultivationId {get;set;}

  private PostLarvaePurchaseEntity(DateOnly date, string label, int quantity, decimal value)
  :base(date,label,quantity,value){}

  public static Result<PostLarvaePurchaseEntity, ModelValidationException> Of(
    DateOnly date, string label, int quantity, decimal value)
    => Create(new PostLarvaePurchaseEntity(date,label,quantity,value));
      
}
