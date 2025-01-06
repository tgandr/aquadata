using Aquadata.Core.Entities.Biometric;
using Aquadata.Core.Entities.Feed;
using Aquadata.Core.Entities.Fertilizer;
using Aquadata.Core.Entities.Harvest;
using Aquadata.Core.Entities.Objective;
using Aquadata.Core.Entities.StressTest;
using Aquadata.Core.Entities.Water;
using Aquadata.Core.Entities.WaterAndAcclimation;
using Aquadata.Core.Enums;
using Aquadata.Core.Interfaces;
using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.Entities.Cultivation;

public class CultivationEntity : SeedWork.Entity, IAggregateRoot
{
  public int PondNumber {get; private set;}
  public int Stock {get; private set;}
  public string PLOrigin {get; private set;}
  public CultivationUniformity Uniformity {get; private set;}
  public DateTime SettlementDate {get; private set;}
  public bool WaterAndAcclimationChecked {get; private set;}

  // Navigation props
  public virtual Guid PondId {get;set;}
  public virtual WaterEntity? Water {get;set;}
  public virtual ObjectiveEntity? Objective {get;set;}
  public virtual StressTestEntity? StressTest {get; set;}
  public virtual ICollection<BiometricEntity>? Biometrics {get; set;}
  public virtual ICollection<WaterEntity>? WaterParams {get; set;}
  public virtual ICollection<HarvestEntity>? Harvests {get; set;}
  public virtual ICollection<FeedEntity>? Feed {get; set;}
  public virtual ICollection<FertilizerEntity>? Fertilizers {get; set;}
  public virtual ICollection<WaterAndAcclimationEntity>? WaterAndAcclimation {get; set;}

  private CultivationEntity() {}
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

  public static Result<CultivationEntity> Of(
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
  
  protected override Result<Entity> Validate()
  {
    if (string.IsNullOrWhiteSpace(PLOrigin))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.Cultivation", 
          "PlOrigin cannot be null or empty")
      );
    return Result<Entity>.Ok(this);
  }
}
