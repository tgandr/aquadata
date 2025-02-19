using System.Text.Json.Serialization;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Stock;
using Aquadata.Core.Enums;
using MediatR;

namespace Aquadata.Application.Dtos;

public class StockDto: IUseCaseRequest<Unit>
{
  public string Label {get;}

  [JsonConverter(typeof(JsonStringEnumConverter))]
  public SupplyType Type {get;}
  public int Quantity {get;}

  public StockDto(string label, SupplyType type, int quantity)
  {
    Label = label;
    Type = type;
    Quantity = quantity;
  }

  public static StockDto FromEntity(StockEntity entity)
    => new StockDto(entity.Label, entity.SupplyType, entity.Quantity);
}
