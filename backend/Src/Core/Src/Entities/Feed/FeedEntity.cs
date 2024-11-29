using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Feed;

public class FeedEntity : SeedWork.Entity
{
  public DateTime Date {get;}
  public int Frequency {get;}
  public float TotalOfDay {get;}
  public string RationName {get;}
  public bool HadLeftovers {get;}
  public bool ReducedOrSuspended {get;}
  public virtual Guid? CultivationId {get;set;}

  public FeedEntity(DateTime date, int frequency, float totalOfDay, 
  string rationName, bool hadLeftovers, bool reducedOrSuspended)
  {
    Date = date;
    Frequency = frequency;
    TotalOfDay = totalOfDay;
    RationName = rationName;
    HadLeftovers = hadLeftovers;
    ReducedOrSuspended = reducedOrSuspended;
  }

  public static Result<FeedEntity,ModelValidationException> Of(DateTime date, int frequency, float totalOfDay, 
  string rationName, bool hadLeftovers, bool reducedOrSuspended
  ) => Create(new FeedEntity(date,frequency, totalOfDay, rationName, 
    hadLeftovers, reducedOrSuspended));

  protected override Result<ModelValidationException> Validate()
  {
    if (string.IsNullOrWhiteSpace(RationName))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("Feed Ration name cannot be null or empty")
      );

    return Result<ModelValidationException>.Ok();
  }
}
