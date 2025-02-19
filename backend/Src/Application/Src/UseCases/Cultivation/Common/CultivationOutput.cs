using System.Text.Json.Serialization;
using Aquadata.Application.Dtos;
using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Enums;

namespace Aquadata.Application.UseCases.Cultivation.Common;

public class CultivationOutput
{
  public Guid Id {get;set;}
  public int PondNumber {get; set;}
  public int Stock {get; set;}
  public string PLOrigin {get; set;}

  [JsonConverter(typeof(JsonStringEnumConverter))]
  public CultivationUniformity Uniformity {get; set;}
  public DateTime SettlementDate {get; set;}
  public bool WaterAndAcclimationChecked {get; set;}
  public ObjectiveDto Objective {get;set;}
  public WaterAndAcclimationCollectionDto? WaterAndAcclimation {get;set;}
  public StressTestDto? StressTest {get;set;}
  public List<BiometricDto>? Biometrics {get;set;}
  public List<WaterDto>? WaterParams {get;set;}
  public List<FertilizerDto>? Fertilizers {get;set;}
  public List<FeedDto> Feed {get;set;}

  public CultivationOutput(Guid id, int pondNumber, int stock, string pLOrigin, 
  CultivationUniformity uniformity, DateTime settlementDate, bool waterAndAcclimationChecked)
  {
    Id = id;
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
      cultivation.Id,
      cultivation.PondNumber, cultivation.Stock, cultivation.PLOrigin, 
      cultivation.Uniformity, cultivation.SettlementDate, cultivation.WaterAndAcclimationChecked
    );

    if (cultivation.WaterAndAcclimation != null &&
    cultivation.WaterAndAcclimation.Count == 2)
      output.WaterAndAcclimation = WaterAndAcclimationCollectionDto
        .FromEntity(cultivation.WaterAndAcclimation);
    
    if (cultivation.StressTest != null)
      output.StressTest = StressTestDto
      .FromEntity(cultivation.StressTest);
    
    if (cultivation.Objective != null)
      output.Objective = ObjectiveDto
      .FromEntity(cultivation.Objective);

    if (cultivation.Biometrics != null 
      && cultivation.Biometrics.Any())
    {
      output.Biometrics = cultivation.Biometrics
        .Select(BiometricDto.FromEntity).ToList();
    }

    if (cultivation.WaterParams != null
      && cultivation.WaterParams.Any())
    {
      output.WaterParams = cultivation.WaterParams
        .Select(WaterDto.FromEntity).ToList();
    }

    if (cultivation.Fertilizers != null
      && cultivation.Fertilizers.Any())
    {
      output.Fertilizers = cultivation.Fertilizers
        .Select(FertilizerDto.FromEntity).ToList();
    }

    if (cultivation.Feed != null
      && cultivation.Feed.Any())
    {
      output.Feed = cultivation.Feed
        .Select(FeedDto.FromEntity).ToList();
    }
      
    return output;
  }
}
