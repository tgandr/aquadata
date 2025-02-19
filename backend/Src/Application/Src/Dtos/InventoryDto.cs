using System.Text.Json.Serialization;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Inventory;
using Aquadata.Core.Enums;
using MediatR;

namespace Aquadata.Application.Dtos;

public class InventoryDto: IUseCaseRequest<Unit>
{
  public string ItemName {get;}
  public decimal AmountInvested {get;}
  public decimal FinalValue {get;}
  public int UsefulLifeInYears {get;}

  [JsonConverter(typeof(JsonStringEnumConverter))]
  public ItemStatus Status {get;}
  public string InOperationSince {get;}  

  public InventoryDto(string itemName, decimal amountInvested, decimal finalValue,
  int usefulLifeInYears, ItemStatus status, string inOperationSince)
  {
    ItemName = itemName;
    AmountInvested = amountInvested;
    FinalValue = finalValue;
    UsefulLifeInYears = usefulLifeInYears;
    Status = status;
    InOperationSince = inOperationSince;
  }

  public static InventoryDto FromEntity(InventoryEntity entity)
    => new InventoryDto(entity.ItemName, entity.AmountInvested, entity.FinalValue,
    entity.UsefulLifeInYears, entity.Status, entity.InOperationSince.ToString());
}
