using Aquadata.Core.Entities.Feed;

namespace Aquadata.Application.Dtos;

public class FeedDto
{
  public DateTime Date {get;}
  public int Frequency {get;}
  public float TotalOfDay {get;}
  public string RationName {get;}
  public bool HadLeftovers {get;}
  public bool ReducedOrSuspended {get;}

  public FeedDto(DateTime date, int frequency, float totalOfDay, 
  string rationName, bool hadLeftovers, bool reducedOrSuspended)
  {
    Date = date;
    Frequency = frequency;
    TotalOfDay = totalOfDay;
    RationName = rationName;
    HadLeftovers = hadLeftovers;
    ReducedOrSuspended = reducedOrSuspended;
  }

  public static FeedDto FromEntity(FeedEntity entity)
    => new(entity.Date, entity.Frequency, entity.TotalOfDay, 
    entity.RationName, entity.HadLeftovers, entity.ReducedOrSuspended);
}
