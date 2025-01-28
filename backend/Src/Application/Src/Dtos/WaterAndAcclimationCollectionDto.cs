namespace Aquadata.Application.Dtos;

public class WaterAndAcclimationCollectionDto
{
  public WaterAndAcclimationDto InPond {get;set;}
  public WaterAndAcclimationDto InTransport {get;set;}

  public WaterAndAcclimationCollectionDto(WaterAndAcclimationDto inPond, 
  WaterAndAcclimationDto inTransport)
  {
    inPond.Origin = Core.Enums.WaterAndAcclimationOrigin.Pond;
    inTransport.Origin = Core.Enums.WaterAndAcclimationOrigin.Transport;
    InPond = inPond;
    InTransport = inTransport;
  }
}
