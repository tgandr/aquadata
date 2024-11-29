using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.UnitTests.Core.Entities.Pond;

public class GetPond
{
  public static PondEntity Valid()
    => PondEntity.Of("name", 10.5f).Unwrap();
  public static Result<PondEntity, ModelValidationException> WithInvalidName()
    => PondEntity.Of("", 10.5f);
  public static Result<PondEntity, ModelValidationException> WithInvalidArea()
    => PondEntity.Of("Name", 0);
}
