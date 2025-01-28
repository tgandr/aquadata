using System.Text.Json.Serialization;
using Aquadata.Core.Entities.StressTest;
using Aquadata.Core.Enums;
using Aquadata.Core.Util;

namespace Aquadata.Application.Dtos;

public class StressTestDto
{
  public string StressType { get; set; }
  public DeadLarvae DeadLarvae { get; set; }
  
  [JsonConverter(typeof(JsonStringEnumConverter))]
  public SwimmingResponse SwimmingResponse { get; set; }

  public StressTestDto(string stressType, DeadLarvae deadLarvae, SwimmingResponse swimmingResponse)
  {
    StressType = stressType;
    DeadLarvae = deadLarvae;
    SwimmingResponse = swimmingResponse;
  }

  public Result<StressTestEntity> ToEntityOrError()
    => StressTestEntity.Of(StressType, DeadLarvae, SwimmingResponse);
}
