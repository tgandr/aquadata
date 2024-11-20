using Aquadata.Core.Entity.Cultivation;
using Aquadata.Core.Enums;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.UnitTests.Domain.Entity.Cultivation;

public class GetCultivation
{
  public static CultivationEntity Valid()
   => CultivationEntity.Of(
        1, 1200, "example", false, CultivationUniformity.Excellent, DateTime.Now
      ).Unwrap();

  public static CultivationEntity WithoutStock()
    => CultivationEntity.Of(
      1, 0, "example", false, CultivationUniformity.Excellent, DateTime.Now
    ).Unwrap();

  public static Result<CultivationEntity, EntityValidationException> WithoutPLOrigin()
    => CultivationEntity.Of(
      1, 20, "", false, CultivationUniformity.Excellent, DateTime.Now
    );
}
