namespace Aquadata.Core.Errors;

public class EntityValidationException : Exception
{
  public EntityValidationException(string message) 
    :base(message){}
}
