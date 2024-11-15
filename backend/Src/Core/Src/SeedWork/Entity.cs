using Aquadata.Core.Util;

namespace Aquadata.Core.SeedWork;

public abstract class Entity
{
  public Guid Id {get;}
  public DateTime CreatedAt {get;}
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

  protected Result<T, Exception> Create<T>(T entity)
    where T : Entity
    => entity.Validate().IfOkReturn(entity);

  protected abstract Result<Exception> Validate();
}
