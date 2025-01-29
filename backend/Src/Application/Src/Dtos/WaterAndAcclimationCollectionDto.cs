using Aquadata.Core.Entities.WaterAndAcclimation;
using Aquadata.Core.Enums;

namespace Aquadata.Application.Dtos;

public class WaterAndAcclimationCollectionDto
{
  public WaterAndAcclimationDto InPond {get;set;}
  public WaterAndAcclimationDto InTransport {get;set;}

  public WaterAndAcclimationCollectionDto(WaterAndAcclimationDto inPond, 
  WaterAndAcclimationDto inTransport)
  {
    inPond.Origin = WaterAndAcclimationOrigin.Pond;
    inTransport.Origin = WaterAndAcclimationOrigin.Transport;
    InPond = inPond;
    InTransport = inTransport;
  }

  public static WaterAndAcclimationCollectionDto FromEntity(
    ICollection<WaterAndAcclimationEntity> waterAndAcclimation)
  {    
    var inPond = waterAndAcclimation.First(w => w.Origin == WaterAndAcclimationOrigin.Pond);
    var inTransport = waterAndAcclimation.First(w => w.Origin == WaterAndAcclimationOrigin.Transport);

    return new WaterAndAcclimationCollectionDto(
      WaterAndAcclimationDto.FromEntity(inPond),
      WaterAndAcclimationDto.FromEntity(inTransport)
    );
  }
}
