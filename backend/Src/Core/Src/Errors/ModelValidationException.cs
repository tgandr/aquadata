namespace Aquadata.Core.Errors;

public class ModelValidationException : Exception
{
  public ModelValidationException(string message) 
    :base(message){}
}
