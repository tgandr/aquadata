using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Util;

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
    DateOnly date, string label, int quantity, decimal value)
    => Create(new PostLarvaePurchaseEntity(date,label,quantity,value));
      
}
