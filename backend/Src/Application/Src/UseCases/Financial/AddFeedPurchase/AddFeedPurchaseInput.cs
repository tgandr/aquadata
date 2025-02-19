using Aquadata.Application.Common;
using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;

namespace Aquadata.Application.UseCases.Financial.AddFeedPurchase;

public class AddFeedPurchaseInput: PurchaseDtoBase, IUseCaseRequest<FeedPurchaseDto>
{
  public string Brand {get;}
  public string Validity {get;}
  public int BagSize {get;}
  public string RationType {get;}

  public AddFeedPurchaseInput(string date, string label, int quantity, decimal value,
  string brand, string validity, int bagSize, string rationType)
  :base(date,label,quantity,value)
  {
    Brand = brand;
    Validity = validity;
    BagSize = bagSize;
    RationType = rationType;
  }
}
