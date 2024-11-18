using Aquadata.Core.Entity.Cultivation;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.UnitTests.Domain.Entity.Cultivation;

public class GetCultivation
{
  public static CultivationEntity Valid()
   => CultivationEntity.Of(
      1, 1200, "example", "good", DateTime.Now
    ).Unwrap();

    public static CultivationEntity WithNoStock()
   => CultivationEntity.Of(
      1, 0, "example", "good", DateTime.Now
    ).Unwrap();
}
