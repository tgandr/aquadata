using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Feed;

public class FeedEntity : SeedWork.Entity
{
  public DateTime Date {get; private set;}
  public int Frequency {get; private set;}
  public float TotalOfDay {get; private set;}
  public string RationName {get; private set;}
  public bool HadLeftovers {get; private set;}
  public bool ReducedOrSuspended {get; private set;}
  public virtual Guid? CultivationId {get;set;}

  private FeedEntity() {}
  private FeedEntity(DateTime date, int frequency, float totalOfDay, 
  string rationName, bool hadLeftovers, bool reducedOrSuspended)
  :base()
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
