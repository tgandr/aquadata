using Aquadata.Core.Entities.Objective;

namespace Aquadata.Application.Dtos;

public class ObjectiveDto
{
  public int Days {get;set;}
  public float AverageSize {get;set;}
  public float SurvivalRate {get;set;}
  
  public ObjectiveDto(int days, float averageSize, float survivalRate)
  {
    Days = days;
    AverageSize = averageSize;
    SurvivalRate = survivalRate;
  }


  public static ObjectiveDto FromEntity(ObjectiveEntity entity)
    => new (entity.Days, entity.AverageSize, entity.SurvivalRate);
}
