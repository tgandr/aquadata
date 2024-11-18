using Aquadata.Core.Entity.Pond;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.UnitTests.Domain.Entity.Pond;

public class GetPond
{
  public static PondEntity Valid()
    => PondEntity.Of("name", 10.5f).Unwrap();
  public static Result<PondEntity, EntityValidationException> WithInvalidName()
    => PondEntity.Of("", 10.5f);
  public static Result<PondEntity, EntityValidationException> WithInvalidArea()
    => PondEntity.Of("Name", 0);
}
