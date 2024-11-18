using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entity.Pond;

public class PondEntity : SeedWork.Entity
{
  public string Name {get;}
  public float Area {get;}

  private PondEntity(string name, float area)
  :base()
  {
    Name = name;
    Area = float.Abs(area);
  }

  public static Result<PondEntity, EntityValidationException> Of(string name, float area)
   => Create(new PondEntity(name,area));
 
  protected override Result<EntityValidationException> Validate()
  {
    if (string.IsNullOrWhiteSpace(Name))
      return Result<EntityValidationException>.Fail(
        new EntityValidationException("Pond name cannot be null or empty"));
    if (Area == float.NegativeZero)
      return Result<EntityValidationException>.Fail(
        new EntityValidationException("Area must be greater than zero")
      );

    return Result<EntityValidationException>.Ok();
  }
}
