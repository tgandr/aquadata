using Aquadata.Core.Util.Result;

namespace Aquadata.Core.Util;


/// <summary>
/// Result is a type that represents either success T or failure Error.
/// </summary>
/// <typeparam name="T">Contains the success value</typeparam>
public class Result<T>
{
  private T? _data;
  public Error Error { get;}
  public bool IsFail { get; }

  protected Result(T data)
  {
    _data = data;
    IsFail = false;
    Error = Error.None;
  }

  protected Result(Error error)
  {
    _data = default;
    Error = error;
    IsFail = true;
  }

  public static Result<T> Ok(T data)
    => new Result<T>(data);

  public static Result<T> Fail(Error error)
    => new Result<T>(error);

  public T Unwrap()
  {
    if (IsFail)
      throw new Exception("Fail Result");
    
    return _data!;
  }

  public static implicit operator Result<T>(T data) => new Result<T>(data);
  public static implicit operator Result<T>(Error error) => new Result<T>(error);
}
