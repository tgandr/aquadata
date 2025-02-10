
using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;


namespace Aquadata.Application.UseCases.Cultivation.AddObjective;

public class AddObjectiveInput: IUseCaseRequest<ObjectiveDto>
{
  public int Days {get;}
  public float AverageSize {get;}
  public float SurvivalRate {get;}
  public Guid CultivationId {get;}	
  public AddObjectiveInput(int days, float averageSize, float survivalRate, Guid cultivationId)
  {
    Days = days;
    AverageSize = averageSize;
    SurvivalRate = survivalRate;
    CultivationId = cultivationId;
  }
}
