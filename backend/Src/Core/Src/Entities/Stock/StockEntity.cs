using Aquadata.Core.Enums;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Stock;

public class StockEntity: SeedWork.Entity
{
  public string Label {get;}
  public SupplyType SupplyType {get;}
  public int Quantity {get;}

  public virtual Guid UserId {get;set;}

  private StockEntity(string label, SupplyType supplyType, int quantity)
  :base()
  {
    Label = label;
    SupplyType = supplyType;
    Quantity = quantity;
  }

  public static Result<StockEntity, ModelValidationException> Of(string label, 
  SupplyType type, int quantity)
    => Create(new StockEntity(label, type, quantity));

  protected override Result<ModelValidationException> Validate()
  {
    if (string.IsNullOrWhiteSpace(Label))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("Stock Label should not be null or empty")
      );

    return Result<ModelValidationException>.Ok();
  }
}
