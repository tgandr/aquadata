namespace Aquadata.Core.Util.Result;

public record Error
{
  public string Code {get;}
  public string Description {get;}
  public ErrorType Type {get;}

  private Error(string code, string description, ErrorType type)
  {
    Code = code;
    Description = description;
    Type = type;
  }

  public static Error None => new(string.Empty, string.Empty, ErrorType.Internal);

  public static Error Internal(string code, string description)
   => new(code, description, ErrorType.Internal);
   
  public static Error Validation(string code, string description)
   => new(code, description, ErrorType.Validation);

  public static Error NotFound(string code, string description)
   => new(code, description, ErrorType.NotFound);

  public static Error Conflict(string code, string description)
   => new(code, description, ErrorType.Conflict);
}
