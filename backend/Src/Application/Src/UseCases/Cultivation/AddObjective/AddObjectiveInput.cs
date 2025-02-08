
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Objective;
using MediatR;

namespace Aquadata.Application.UseCases.Cultivation.AddObjective;

public class AddObjectiveInput: IUseCaseRequest<Unit>
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
