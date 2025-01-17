
using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.ValueObjects;

public class PH : SeedWork.ValueObject
{
  public byte Value {get;set;}
  
  private PH(){}
  private PH(byte value)
  {
    Value = value;
  }
  
  public static Result<PH> Of(byte value)
    => Create(new PH(value));
  

  public override Result<ValueObject> Validate()
  {
    if (Value < 0 || Value > 14)
      return Result<ValueObject>.Fail(
       Error.Validation(
        "Core.PH",
        "Ph value must be between 0 and 14"
      )
    );  

    return Result<ValueObject>.Ok(this);
  }

  public override bool Equals(SeedWork.ValueObject? other)
   => other is PH ph && ph.Value == Value;

  public override int GetCustomHashCode()
    => HashCode.Combine(Value);

}
