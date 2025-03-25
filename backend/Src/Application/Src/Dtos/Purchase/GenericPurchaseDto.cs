using Aquadata.Application.Common;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Purchase;
using MediatR;

namespace Aquadata.Application.Dtos;

public class GenericPurchaseDto : PurchaseDtoBase, IUseCaseRequest<Unit>
{
  public string Description {get;}
  public GenericPurchaseDto(string date, string label, int quantity, 
  decimal value, string description) 
  :base(date, label, quantity, value)
  {
    Description = description;
  }

  public static GenericPurchaseDto FromEntity(GenericPurchaseEntity entity)
    => new(entity.Date.ToString(),entity.Label,entity.Quantity,entity.Value,
    entity.Description);
}
