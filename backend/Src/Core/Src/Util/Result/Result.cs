namespace Aquadata.Core.Util;


/// <summary>
/// Result is a type that represents either success T or failure E.
/// Based on Rust type Result.
/// </summary>
/// <typeparam name="T">Contains the success value</typeparam>
/// <typeparam name="E">Contains the exception value</typeparam>
public class Result<T, E>
  where E : Exception
{
  private T? _data;
  public E? Error { get;}
  public bool IsFail { get; }

  protected Result(T data)
  {
    _data = data;
    IsFail = false;
  }

  protected Result(E error)
  {
    _data = default;
    Error = error;
    IsFail = true;
  }

  protected Result()
  {
    _data = default;
    Error = default;
    IsFail = false;
  }

  public static Result<T,E> Ok(T data)
  {
    return new Result<T,E>(data);
  }

  public static Result<E> Ok()
  {
    return Result<E>.Ok();
  }

  public static Result<T,E> Fail(E error)
  {
    return new Result<T,E>(error);
  }

  /// <summary>
  /// Returns T data if is Ok, otherwise throw exception
  /// </summary>
  public T Unwrap()
  {
    if (!IsFail && _data != null)
      return _data!;
    if (!IsFail && _data == null)
      throw new Exception("Cannot Unwrap empty result");
    else throw Error!;
  }

  /// <summary>
  /// Return Ok Result if IsFail is false, otherwise return Fail Result.
  /// </summary>
  /// <typeparam name="TReturn">Type of returned value</typeparam>
  /// <param name="res">Value to be returned as Ok</param>
  public Result<TReturn, E> IfOkReturn<TReturn>(TReturn res)
  {
    if (!IsFail)
      return new Result<TReturn,E>(res);
    return new Result<TReturn,E>(Error!);
  }

  public static implicit operator Result<T,E>(T data) => new Result<T,E>(data);
  public static implicit operator Result<T,E>(E error) => new Result<T,E>(error);
}

public class Result<E>: Result<object, E>
  where E: Exception
{
  private Result(E error)
    :base(error) {}
  
  private Result()
    :base(){}

  public new static Result<E> Ok()
  {
    return new Result<E>();
  }

  public new static Result<E> Fail(E error)
  {
    return new Result<E>(error);
  }

  public static implicit operator Result<E>(E error) => new Result<E>(error);
}
