using Aquadata.Application.Common;
using Aquadata.Core.Entities.Purchase;

namespace Aquadata.Application.Dtos;

public class PLPurchaseDto : PurchaseDtoBase
{
  public string CultivationId {get;}
  
  public PLPurchaseDto(string date, string label, int quantity, 
  decimal value, string cultivationId)
  :base(date, label, quantity, value)
  {
    CultivationId = cultivationId;
  }

  public static PLPurchaseDto FromEntity(PostLarvaePurchaseEntity entity)
    => new(
      entity.Date.ToString(), 
      entity.Label, 
      entity.Quantity, 
      entity.Value, 
      entity.CultivationId.ToString()
    );
}
