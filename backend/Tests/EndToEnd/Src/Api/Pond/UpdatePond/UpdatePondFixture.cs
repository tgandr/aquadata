using Aquadata.Application.UseCases.Pond.UpdatePond;
using Aquadata.EndToEndTests.Api.Pond.Common;

namespace Aquadata.EndToEndTests.Api.Pond.UpdatePond;

[CollectionDefinition(nameof(UpdatePondFixture))]
public class UpdatePondFixture: PondTestFixture
, ICollectionFixture<UpdatePondFixture>
{
  public UpdatePondInput GetInput(Guid id)
    => new(id, "newName", 88f);
}
