using Aquadata.Core.Enums;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Inventory;

public class InventoryEntity : SeedWork.Entity
{
  public string ItemName {get;}
  public decimal AmountInvested {get;}
  public decimal FinalValue {get;}
  public int UsefulLifeInYears {get;}
  public ItemStatus Status {get;}
  public DateOnly InOperationSince {get;}

  public virtual Guid UserId {get;}

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

  public static Result<InventoryEntity, ModelValidationException> Of(string itemName, decimal amountInvested, 
  decimal finalValue, int usefulLifeInYears, ItemStatus status, DateOnly inOperationSince)
    => Create(new InventoryEntity(itemName, amountInvested, 
    finalValue, usefulLifeInYears, status, inOperationSince));

  protected override Result<ModelValidationException> Validate()
    => Result<ModelValidationException>.Ok();
}
