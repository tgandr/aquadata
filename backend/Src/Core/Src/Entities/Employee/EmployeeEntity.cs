using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.Entities.Employee;

public class EmployeeEntity : Entity
{
  public string Name {get; private set;}

  public virtual Guid UserId {get;set;}

  private EmployeeEntity(string name) :base()
  {
    Name = name;
  }

  private EmployeeEntity() {}
  public static Result<EmployeeEntity> Of(string name)
    => Create(new EmployeeEntity(name));
  protected override Result<Entity> Validate()
  {
    if (string.IsNullOrWhiteSpace(Name))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.Employee", 
          "Name cannot be null or empty"
        )
      );

    return Result<Entity>.Ok(this);
  }
}
