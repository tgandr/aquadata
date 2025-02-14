using Aquadata.Application.Common;
using Aquadata.Core.Entities.Purchase;

namespace Aquadata.Application.Dtos;

public class FeedPurchaseDto: PurchaseDtoBase
{
  public string Brand {get;}
  public string Validity {get;}
  public int BagSize {get;}
  public string RationType {get;}

  public FeedPurchaseDto(string date, string label, int quantity, decimal value,
  string brand, string validity, int bagSize, string rationType)
  :base(date,label,quantity,value)
  {
    Brand = brand;
    Validity = validity;
    BagSize = bagSize;
    RationType = rationType;
  }

  public static FeedPurchaseDto FromEntity(FeedPurchaseEntity entity)
    => new(entity.Date.ToString(), entity.Label,entity.Quantity,entity.Value, entity.Brand,
    entity.Validity.ToString(), entity.BagSize, entity.RationType);
}
