using System.Text.Json.Serialization;
using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Cultivation.Common;
using Aquadata.Core.Enums;

namespace Aquadata.Application.UseCases.Cultivation;

public class CreateCultivationInput: IUseCaseRequest<CultivationOutput>
{
  public int PondNumber {get;}
  public int Stock {get;}
  public string PLOrigin {get;}
  
  [JsonConverter(typeof(JsonStringEnumConverter))]
  public CultivationUniformity Uniformity {get;}
  public DateTime SettlementDate {get;}
  public bool WaterAndAcclimationChecked {get;}
  public Guid PondId {get;}

  [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
  public StressTestDto? StressTest {get;set;}

  [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
  public WaterAndAcclimationCollectionDto? WaterAndAcclimation {get;set;}

  public CreateCultivationInput(
    int pondNumber,
    int stock,
    string plOrigin,
    CultivationUniformity uniformity,
    DateTime settlementDate,
    bool waterAndAcclimationChecked,
    Guid pondId
  )
  {
    PondNumber = pondNumber;
    Stock = stock;
    PLOrigin = plOrigin;
    Uniformity = uniformity;
    SettlementDate = settlementDate;
    WaterAndAcclimationChecked = waterAndAcclimationChecked;
    PondId = pondId;
  }
}
