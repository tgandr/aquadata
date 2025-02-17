using Aquadata.Application.Common;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Enums;
using MediatR;

namespace Aquadata.Application.Dtos;

public class FertilizerPurchaseDto : PurchaseDtoBase, IUseCaseRequest<Unit>
{
  public MeasureUnit Unit {get;}
  public FertilizerPurchaseDto(string date, string label, int quantity, 
  decimal value, MeasureUnit unit) 
  :base(date, label, quantity, value)
  {
    Unit = unit;
  }

  public static FertilizerPurchaseDto FromEntity(FertilizerPurchaseEntity entity)
    => new(entity.Date.ToString(), entity.Label, entity.Quantity, entity.Value, entity.Unit);
}
