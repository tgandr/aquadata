using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Pond;

public class PondEntity : SeedWork.Entity
{
  public string Name {get;}
  public float Area {get;}
  public virtual ICollection<CultivationEntity>? Cultivations {get;}

  private PondEntity(string name, float area)
  :base()
  {
    Name = name;
    Area = float.Abs(area);
  }

  public static Result<PondEntity, ModelValidationException> Of(string name, float area)
   => Create(new PondEntity(name,area));
 
  protected override Result<ModelValidationException> Validate()
  {
    if (string.IsNullOrWhiteSpace(Name))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("Pond name cannot be null or empty"));
    if (Area == float.NegativeZero)
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("Area must be greater than zero")
      );

    return Result<ModelValidationException>.Ok();
  }
}
