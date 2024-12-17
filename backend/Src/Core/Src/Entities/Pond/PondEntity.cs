using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Errors;
using Aquadata.Core.Interfaces;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Pond;

public class PondEntity : SeedWork.Entity, IAggregateRoot
{
  public string Name {get;private set;}
  public float Area {get;private set;}
  public bool IsActive {get;private set;}
  public virtual ICollection<CultivationEntity>? Cultivations {get;set;}

  private PondEntity(string name, float area, bool isActive = true)
  :base()
  {
    Name = name;
    Area = float.Abs(area);
    IsActive = isActive;
  }

  public static Result<PondEntity, ModelValidationException> Of(string name, float area, bool isActive = true)
   => Create(new PondEntity(name,area, isActive));
  
  public void Update(string name, float area)
  {
    Name = name;
    Area = area;
  }

  public void Activate()
   => IsActive = true;
  
  public void Deactivate()
   => IsActive = false;

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
