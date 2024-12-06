using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Employee;

public class EmployeeEntity : SeedWork.Entity
{
  public string Name {get;}

  private EmployeeEntity(string name) :base()
  {
    Name = name;
  }

  public static Result<EmployeeEntity, ModelValidationException> Of(string name)
    => Create(new EmployeeEntity(name));
  protected override Result<ModelValidationException> Validate()
  {
    if (string.IsNullOrWhiteSpace(Name))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("Employee name cannot be null or empty")
      );

    return Result<ModelValidationException>.Ok();
  }
}
