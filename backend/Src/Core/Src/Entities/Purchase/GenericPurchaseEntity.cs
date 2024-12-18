
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Purchase;

public class GenericPurchaseEntity : PurchaseBase
{
  public string Description { get;}
  private GenericPurchaseEntity(DateOnly date, string label, int quantity, decimal value, 
  string description) 
  : base(date, label, quantity, value)
  {
    Description = description;
  }

  private GenericPurchaseEntity()
  :base(DateOnly.MinValue,"",0,0) {}
  
  public static Result<GenericPurchaseEntity, ModelValidationException> Of(
    DateOnly date, string label, int quantity, decimal value, 
    string description
  ) => Create(new GenericPurchaseEntity(date,label,quantity,value,description));

  protected override Result<ModelValidationException> Validate()
  { 
    if (string.IsNullOrWhiteSpace(Description))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("Purchase description cannot be null or empty")
      );

    return Result<ModelValidationException>.Ok();
  }
}
