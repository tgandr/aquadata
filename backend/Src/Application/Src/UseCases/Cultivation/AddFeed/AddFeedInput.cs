using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;

namespace Aquadata.Application.UseCases.Cultivation.AddFeed;

public class AddFeedInput: IUseCaseRequest<FeedDto>
{
  public DateTime Date {get;}
  public int Frequency {get;}
  public float TotalOfDay {get;}
  public string RationName {get;}
  public bool HadLeftovers {get;}
  public bool ReducedOrSuspended {get;}
  public Guid CultivationId {get;set;}

  public AddFeedInput(DateTime date, int frequency, float totalOfDay, 
  string rationName, bool hadLeftovers, bool reducedOrSuspended, Guid cultivationId)
  {
    Date = date;
    Frequency = frequency;
    TotalOfDay = totalOfDay;
    RationName = rationName;
    HadLeftovers = hadLeftovers;
    ReducedOrSuspended = reducedOrSuspended;
    CultivationId = cultivationId;
  }  
}
