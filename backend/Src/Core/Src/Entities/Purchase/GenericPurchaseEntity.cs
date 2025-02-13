using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.Entities.Purchase;

public class GenericPurchaseEntity : PurchaseBase
{
  public string Description { get; private set;}
  private GenericPurchaseEntity(DateOnly date, string label, int quantity, decimal value, 
  string description) 
  : base(date, label, quantity, value)
  {
    Description = description;
  }

  private GenericPurchaseEntity()
  :base(DateOnly.MinValue,"",0,0) {}
  
  public static Result<GenericPurchaseEntity> Of(
    string date, string label, int quantity, decimal value, 
    string description)
  {
    DateOnly parsedDate;
    var isValidDate = DateOnly.TryParse(date, out parsedDate);
    if (!isValidDate)
      return Result<GenericPurchaseEntity>.Fail(
        Error.Validation(
          "Core.GenericPurchase",
          "Invalid date format"
    ));
    return Create(new GenericPurchaseEntity(parsedDate,
    label,quantity,value,description));
  }

  protected override Result<Entity> Validate()
  { 
    if (string.IsNullOrWhiteSpace(Description))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.Purchase",
          "Description cannot be null or empty"
        )
      );

    return Result<Entity>.Ok(this);
  }
}
