using System.Text.Json.Serialization;
using Aquadata.Application.Common;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Enums;
using MediatR;

namespace Aquadata.Application.UseCases.User.Purchase.AddProbioticPurchase;

public class ProbioticPurchaseDto : PurchaseDtoBase,
IUseCaseRequest<Unit>
{
  [JsonConverter(typeof(JsonStringEnumConverter))]
  public MeasureUnit Unit {get;}

  public ProbioticPurchaseDto(string date, string label, int quantity, 
  decimal value, MeasureUnit unit) 
  :base(date, label, quantity, value)
  {
    Unit = unit;
  }

  public static ProbioticPurchaseDto FromEntity(ProbioticsPurchaseEntity entity)
    => new(entity.Date.ToString(), entity.Label, entity.Quantity, 
    entity.Value, entity.Unit);
}
