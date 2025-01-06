using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.SeedWork;

public abstract class Entity
{
  public Guid Id {get;}
  public DateTime CreatedAt {get;set;}
  public DateTime UpdatedAt {get;set;}

  protected Entity(Guid id) 
  {
    Id = id;
    CreatedAt = DateTime.Now;
    UpdatedAt = DateTime.Now;
  }
  protected Entity()
  {
    Id = Guid.NewGuid();
    CreatedAt = DateTime.Now;
    UpdatedAt = DateTime.Now;
  }

  protected static Result<T> Create<T>(T entity)
    where T : Entity
  {
    var result = entity.Validate();

    if (result.IsFail)
      return Result<T>.Fail(
        Error.None
      );

    return Result<T>.Ok(entity);
  }

  protected abstract Result<Entity> Validate();
}
