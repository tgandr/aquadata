using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.ValueObjects;

public class PH : SeedWork.ValueObject
{
  public byte Value {get;}

  private PH(byte value)
  {
    Value = value;
  }
  
  public static Result<PH, ModelValidationException> Of(byte value)
    => Create(new PH(value));
  

  public override Result<ModelValidationException> Validate()
  {
    if (Value < 0 || Value > 14)
      return Result<ModelValidationException>.Fail(new ModelValidationException(
        "Ph value must be between 0 and 14"
      ));  

    return Result<ModelValidationException>.Ok();
  }

  public override bool Equals(SeedWork.ValueObject? other)
   => other is PH ph && ph.Value == Value;

  public override int GetCustomHashCode()
    => HashCode.Combine(Value);

}
