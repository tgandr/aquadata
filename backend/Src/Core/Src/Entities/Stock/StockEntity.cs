using Aquadata.Core.Enums;
using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.Entities.Stock;

public class StockEntity: Entity
{
  public string Label {get; private set;}
  public SupplyType SupplyType {get; private set;}
  public int Quantity {get; private set;}

  public virtual Guid UserId {get;set;}

  private StockEntity(){}
  private StockEntity(string label, SupplyType supplyType, int quantity)
  :base()
  {
    Label = label;
    SupplyType = supplyType;
    Quantity = quantity;
  }

  public static Result<StockEntity> Of(string label, 
  SupplyType type, int quantity)
    => Create(new StockEntity(label, type, quantity));

  protected override Result<Entity> Validate()
  {
    if (string.IsNullOrWhiteSpace(Label))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.Stock",
          "Label should not be null or empty"
        )
      );

    return Result<Entity>.Ok(this);
  }
}
