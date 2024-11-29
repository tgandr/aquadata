using Aquadata.Core.Errors;
using Aquadata.Core.Util;
using Core.Src.Enums;

namespace Aquadata.Core.Entities.Fertilizer;

public class FertilizerEntity : SeedWork.Entity
{
  public string Name {get;}
  public DateTime Date {get;}
  public FertilizerType Type {get;}
  public int Quantity {get;}
  public MeasureUnit MeasureUnit {get;}
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

  public static Result<FertilizerEntity, ModelValidationException> Of(string name, DateTime date, FertilizerType type, 
  int quantity, MeasureUnit measureUnit)
    => Create(new FertilizerEntity(name, date, type, quantity, measureUnit));

  protected override Result<ModelValidationException> Validate()
  {
    if (string.IsNullOrWhiteSpace(Name))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("Fertilizer name cannot be null or empty")
      );
    return Result<ModelValidationException>.Ok();
  }
}
