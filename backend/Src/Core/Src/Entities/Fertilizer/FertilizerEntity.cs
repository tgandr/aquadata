using Aquadata.Core.Enums;
using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.Entities.Fertilizer;

public class FertilizerEntity : SeedWork.Entity
{
  public string Name {get; private set;}
  public DateTime Date {get; private set;}
  public FertilizerType Type {get; private set;}
  public int Quantity {get; private set;}
  public MeasureUnit MeasureUnit {get; private set;}
  public virtual Guid? CultivationId {get;set;}

  private FertilizerEntity(string name, DateTime date, FertilizerType type, 
  int quantity, MeasureUnit measureUnit)
  {
    Name = name;
    Date = date;
    Type = type;
    Quantity = quantity;
    MeasureUnit = measureUnit;
  }

  private FertilizerEntity(){}
  public static Result<FertilizerEntity> Of(string name, DateTime date, FertilizerType type, 
  int quantity, MeasureUnit measureUnit)
    => Create(new FertilizerEntity(name, date, type, quantity, measureUnit));

  protected override Result<Entity> Validate()
  {
    if (string.IsNullOrWhiteSpace(Name))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.Fertilizer",
          "Name cannot be null or empty"
        )
      );
    return Result<Entity>.Ok(this);
  }
}
