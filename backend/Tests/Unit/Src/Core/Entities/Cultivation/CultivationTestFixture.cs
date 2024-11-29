using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Enums;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.UnitTests.Core.Entities.Cultivation;

public class GetCultivation
{
  public static CultivationEntity Valid()
   => CultivationEntity.Of(
        1, 1200, "example", false, CultivationUniformity.Excellent, DateTime.Now
      ).Unwrap();

  public static CultivationEntity WithInvalidStock()
    => CultivationEntity.Of(
      1, 0, "example", false, CultivationUniformity.Excellent, DateTime.Now
    ).Unwrap();

  public static Result<CultivationEntity, ModelValidationException> WithInvalidPLOrigin()
    => CultivationEntity.Of(
      1, 20, "", false, CultivationUniformity.Excellent, DateTime.Now
    );
}
