using Aquadata.Core.Enums;
using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.Entities.Inventory;

public class InventoryEntity : Entity
{
  public string ItemName {get; private set;}
  public decimal AmountInvested {get; private set;}
  public decimal FinalValue {get; private set;}
  public int UsefulLifeInYears {get; private set;}
  public ItemStatus Status {get; private set;}
  public DateOnly InOperationSince {get; private set;}

  public virtual Guid UserId {get; set;}

  private InventoryEntity() {}
  private InventoryEntity(string itemName, decimal amountInvested, 
  decimal finalValue, int usefulLifeInYears, ItemStatus status, DateOnly inOperationSince)
  :base()
  {
    ItemName = itemName;
    AmountInvested = amountInvested;
    FinalValue = finalValue;
    UsefulLifeInYears = usefulLifeInYears;
    Status = status;
    InOperationSince = inOperationSince;
  }

  public static Result<InventoryEntity> Of(string itemName, decimal amountInvested, 
  decimal finalValue, int usefulLifeInYears, ItemStatus status, string inOperationSince)
  {
    DateOnly parsedDate;
    var isValidDate = DateOnly.TryParse(inOperationSince, out parsedDate);
    if (!isValidDate)
      return Result<InventoryEntity>.Fail(
        Error.Validation(
          "Core.Inventory",
          "Invalid date format"
    ));

    return Create(new InventoryEntity(itemName, amountInvested, 
    finalValue, usefulLifeInYears, status, parsedDate));
  }

  protected override Result<Entity> Validate()
    => Result<Entity>.Ok(this);
}
