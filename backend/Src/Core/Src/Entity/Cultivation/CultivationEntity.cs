using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entity.Cultivation;

public class CultivationEntity : SeedWork.Entity
{
  public int Number {get;}
  public int Stock {get;}
  public string PLOrigin {get;}
  public string Uniformity {get;}
  public DateTime SettlementDate {get;}
  public virtual Guid? PondId {get;set;}

  private CultivationEntity(int number, int stock, string pLOrigin, 
  string uniformity, DateTime settlementDate) 
  : base()
  {
    Number = int.Abs(number);
    Stock = int.Abs(stock);
    PLOrigin = pLOrigin;
    Uniformity = uniformity;
    SettlementDate = settlementDate;
  }

  public static Result<CultivationEntity, EntityValidationException> Of(int number, int stock, string pLOrigin, 
  string uniformity, DateTime settlementDate)
    => Create(new CultivationEntity(
      number, stock, pLOrigin, uniformity, settlementDate
    ));

  public bool HasShrimp()
    => Stock > 0; 
  

  protected override Result<EntityValidationException> Validate()
  {
    return Result<EntityValidationException>.Ok();
  }
}
