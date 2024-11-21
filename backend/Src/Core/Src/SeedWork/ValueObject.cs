using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.SeedWork;

public abstract class ValueObject : IEquatable<ValueObject>
{
  public abstract bool Equals(ValueObject? other);
  public abstract int GetCustomHashCode();
  public override bool Equals(object? obj)
  {
    if (ReferenceEquals(null, obj)) return false;
    if (ReferenceEquals(this, obj)) return true;
    return obj.GetType() == GetType() 
      && Equals((ValueObject)obj);
  }

  public override int GetHashCode() => GetCustomHashCode();

  public static bool operator == (ValueObject? left, ValueObject? right)
    => left?.Equals(right) ?? false;

  public static bool operator != (ValueObject? left, ValueObject right)
    => !(left == right);

  protected static Result<T, ModelValidationException> Create<T>(T vo)
    where T: ValueObject
    => vo.Validate().IfOkReturn(vo);

  public abstract Result<ModelValidationException> Validate();
}
