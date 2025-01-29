using Aquadata.Application.Dtos;
using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Enums;

namespace Aquadata.Application.UseCases.Cultivation.Common;

public class CultivationOutput
{
  public int PondNumber {get; set;}
  public int Stock {get; set;}
  public string PLOrigin {get; set;}
  public CultivationUniformity Uniformity {get; set;}
  public DateTime SettlementDate {get; set;}
  public bool WaterAndAcclimationChecked {get; set;}
  public WaterAndAcclimationCollectionDto? WaterAndAcclimation {get;set;}
  public StressTestDto? StressTest {get;set;}

  public CultivationOutput(int pondNumber, int stock, string pLOrigin, 
  CultivationUniformity uniformity, DateTime settlementDate, bool waterAndAcclimationChecked)
  {
    PondNumber = pondNumber;
    Stock = stock;
    PLOrigin = pLOrigin;
    Uniformity = uniformity;
    SettlementDate = settlementDate;
    WaterAndAcclimationChecked = waterAndAcclimationChecked;
  }

  public static CultivationOutput FromEntity(CultivationEntity cultivation)
  {
    var output = new CultivationOutput(
      cultivation.PondNumber, cultivation.Stock, cultivation.PLOrigin, 
      cultivation.Uniformity, cultivation.SettlementDate, cultivation.WaterAndAcclimationChecked
    );

    if (cultivation.WaterAndAcclimation != null)
      output.WaterAndAcclimation = WaterAndAcclimationCollectionDto
        .FromEntity(cultivation.WaterAndAcclimation);
    
    if (cultivation.StressTest != null)
      output.StressTest = StressTestDto
      .FromEntity(cultivation.StressTest);
    

    return output;
  }
}
