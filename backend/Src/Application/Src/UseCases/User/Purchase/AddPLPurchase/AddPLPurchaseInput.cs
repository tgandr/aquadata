using Aquadata.Application.Common;
using Aquadata.Application.Interfaces;
using MediatR;

namespace Aquadata.Application.UseCases.User.Purchase.AddPLPurchase;

public class AddPLPurchaseInput: PurchaseDtoBase, IUseCaseRequest<Unit>
{
  public Guid UserId {get;set;}
  public Guid CultivationId {get;set;}

  public AddPLPurchaseInput(string date, string label, 
  int quantity, decimal value, Guid userId, Guid cultivationId) 
  :base(date, label, quantity, value)
  {
    UserId = userId;
    CultivationId = cultivationId;
  }
}
