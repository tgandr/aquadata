using Aquadata.Core.Entities.Biometric;
using Aquadata.Core.Entities.Feed;
using Aquadata.Core.Entities.Fertilizer;
using Aquadata.Core.Entities.Harvest;
using Aquadata.Core.Entities.StressTest;
using Aquadata.Core.Entities.Water;
using Aquadata.Core.Entities.WaterAndAcclimation;
using Aquadata.Core.Enums;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Cultivation;

public class CultivationEntity : SeedWork.Entity
{
  public int PondNumber {get;}
  public int Stock {get;}
  public string PLOrigin {get;}
  public CultivationUniformity Uniformity {get;}
  public DateTime SettlementDate {get;}
  public bool WaterAndAcclimationChecked {get;}

  // Navigation props
  public virtual Guid? PondId {get;set;}
  public virtual ICollection<BiometricEntity>? Biometrics {get; set;}
  public virtual ICollection<WaterEntity>? WaterParams {get; set;}
  public virtual ICollection<HarvestEntity>? Harvests {get; set;}
  public virtual ICollection<FeedEntity>? Feed {get; set;}
  public virtual ICollection<FertilizerEntity>? Fertilizers {get; set;}
  public virtual ICollection<WaterAndAcclimationEntity>? WaterAndAcclimation {get; set;}
  public virtual StressTestEntity? StressTest {get; set;}

  private CultivationEntity(int pondNumber, int stock, string pLOrigin, 
  bool waterAndAcclimationChecked, CultivationUniformity uniformity, 
  DateTime settlementDate)
  : base()
  {
    PondNumber = int.Abs(pondNumber);
    Stock = int.Abs(stock);
    PLOrigin = pLOrigin;
    Uniformity = uniformity;
    SettlementDate = settlementDate;
    WaterAndAcclimationChecked = waterAndAcclimationChecked;

    if (WaterAndAcclimation is not null)
      WaterAndAcclimationChecked = true;
  }

  public static Result<CultivationEntity, ModelValidationException> Of(
    int pondNumber, int stock, string pLOrigin, 
    bool waterAndAcclimationChecked, CultivationUniformity uniformity, 
    DateTime settlementDate)
  => Create(new CultivationEntity(
      pondNumber, stock, pLOrigin, 
      waterAndAcclimationChecked, 
      uniformity, settlementDate
    ));

  public bool HasShrimp()
    => Stock > 0; 
  
  protected override Result<ModelValidationException> Validate()
  {
    if (string.IsNullOrWhiteSpace(PLOrigin))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("Cultivation PlOrigin cannot be null or empty")
      );
    return Result<ModelValidationException>.Ok();
  }
}
