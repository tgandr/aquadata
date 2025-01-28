using System.Text.Json.Serialization;
using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.StressTest;
using Aquadata.Core.Enums;
using MediatR;

namespace Aquadata.Application.UseCases.Cultivation;

public class AddCultivationInput: IUseCaseRequest<Unit>
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

  public AddCultivationInput(
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
