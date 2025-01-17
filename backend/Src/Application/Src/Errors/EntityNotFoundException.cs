namespace Aquadata.Application.Errors;

public class EntityNotFoundException: Exception
{
  public EntityNotFoundException()
    :base("Entity not found"){}
}
