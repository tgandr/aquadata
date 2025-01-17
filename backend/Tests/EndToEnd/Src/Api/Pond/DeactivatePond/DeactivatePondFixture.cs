using Aquadata.Application.UseCases.Pond.DeactivatePond;
using Aquadata.EndToEndTests.Api.Pond.Common;

namespace Aquadata.EndToEndTests.Api.Pond.DeactivatePond;

[CollectionDefinition(nameof(DeactivatePondFixture))]
public class DeactivatePondFixture: PondTestFixture
, ICollectionFixture<DeactivatePondFixture>
{
  public DeactivatePondInput GetInput(Guid id)
    => new(id, Guid.NewGuid());
}
