using Aquadata.Application.Common;
using Aquadata.Application.Interfaces;
using MediatR;

namespace Aquadata.Application.UseCases.Financial.AddPLPurchase;

public class AddPLPurchaseInput: PurchaseDtoBase, IUseCaseRequest<Unit>
{
  public Guid CultivationId {get;set;}

  public AddPLPurchaseInput(string date, string label, 
  int quantity, decimal value, Guid cultivationId) 
  :base(date, label, quantity, value)
  {
    CultivationId = cultivationId;
  }
}
