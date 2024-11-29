using Aquadata.Core.Entities.Biometric;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Harvest;

public class HarvestEntity : SeedWork.Entity
{
  public string Buyer {get;}
  public decimal Price {get;}
  public DateTime Date {get;}
  public bool IsTotal {get;}
  public float BioMass {get;}
  
  public virtual ICollection<BiometricEntity>? Biometrics {get; set;}
  public virtual Guid? CultivationId {get;set;}

  private HarvestEntity(string buyer, decimal price, 
  DateTime date, bool isTotal, float bioMass)
  {
    Buyer = buyer;
    Price = decimal.Abs(price);
    Date = date;
    IsTotal = isTotal;
    BioMass = bioMass;
  }

  public static Result<HarvestEntity,ModelValidationException> Of(
    string buyer, decimal price, 
    DateTime date, bool isTotal, float bioMass
  ) => Create(new HarvestEntity(buyer, price, date, isTotal, bioMass));

  protected override Result<ModelValidationException> Validate()
  {
    if (string.IsNullOrWhiteSpace(Buyer))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("Harvest buyer cannot be null or empty")
      );

    return Result<ModelValidationException>.Ok();
  }
}
