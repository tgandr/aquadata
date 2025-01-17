using Aquadata.Core.Entities.Pond;

namespace Aquadata.IntegrationTests.Application.UseCases.Pond.Common;

public class PondTestFactory
{
  public static PondEntity GetValidPond()
    => PondEntity.Of("name", 10.4f, true).Unwrap();
}
