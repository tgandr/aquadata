using Aquadata.Core.Entities.Biometric;
using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.Entities.Harvest;

public class HarvestEntity : Entity
{
  public string Buyer {get; private set;}
  public decimal Price {get; private set;}
  public DateTime Date {get; private set;}
  public bool IsTotal {get; private set;}
  public float BioMass {get; private set;}
  
  public virtual Guid CultivationId {get;set;}
  public virtual ICollection<BiometricEntity> Biometrics {get; set;} 

  private HarvestEntity(string buyer, decimal price, 
  DateTime date, bool isTotal, float bioMass)
  {
    Buyer = buyer;
    Price = decimal.Abs(price);
    Date = date;
    IsTotal = isTotal;
    BioMass = bioMass;
  }
  private HarvestEntity() {}
  public static Result<HarvestEntity> Of(
    string buyer, decimal price, 
    DateTime date, bool isTotal, float bioMass
  ) => Create(new HarvestEntity(buyer, price, date, isTotal, bioMass));

  protected override Result<Entity> Validate()
  {
    if (string.IsNullOrWhiteSpace(Buyer))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.Harvest",
          "Buyer cannot be null or empty"
        )
      );

    return Result<Entity>.Ok(this);
  }
}
