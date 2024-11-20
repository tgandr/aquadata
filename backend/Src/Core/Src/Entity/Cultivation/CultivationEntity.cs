using Aquadata.Core.Entity.Biometric;
using Aquadata.Core.Enums;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entity.Cultivation;

public class CultivationEntity : SeedWork.Entity
{
  public int PondNumber {get;}
  public int Stock {get;}
  public string PLOrigin {get;}
  public CultivationUniformity Uniformity {get;}
  public DateTime SettlementDate {get;}
  public bool WaterAndAcclimationChecked {get;}
  public CultivationOptional? Optional {get;}
  public virtual Guid? PondId {get;}
  public virtual ICollection<BiometricEntity>? Biometrics {get;}

  private CultivationEntity(int pondNumber, int stock, string pLOrigin, 
  bool waterAndAcclimationChecked, CultivationUniformity uniformity, 
  DateTime settlementDate, CultivationOptional? optional = null)
  : base()
  {
    PondNumber = int.Abs(pondNumber);
    Stock = int.Abs(stock);
    PLOrigin = pLOrigin;
    Uniformity = uniformity;
    SettlementDate = settlementDate;
    WaterAndAcclimationChecked = waterAndAcclimationChecked;
    Optional = optional;

    if (Optional?.WaterAndAcclimation is not null)
      WaterAndAcclimationChecked = true;  
  }

  public static Result<CultivationEntity, EntityValidationException> Of(
    int pondNumber, int stock, string pLOrigin, 
    bool waterAndAcclimationChecked, CultivationUniformity uniformity, 
    DateTime settlementDate, CultivationOptional? optional = null)
  => Create(new CultivationEntity(
      pondNumber, stock, pLOrigin, 
      waterAndAcclimationChecked, 
      uniformity, settlementDate, optional
    ));

  public bool HasShrimp()
    => Stock > 0; 
  

  protected override Result<EntityValidationException> Validate()
  {
    if (string.IsNullOrWhiteSpace(PLOrigin))
      return Result<EntityValidationException>.Fail(
        new EntityValidationException("Cultivation PlOrigin cannot be null or empty")
      );

    return Result<EntityValidationException>.Ok();
  }
}
