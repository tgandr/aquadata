using Aquadata.Application.UseCases.Pond.CreatePond;
using Aquadata.Core.Entities.Pond;
using Aquadata.EndToEndTests.Api.Pond.Common;

namespace Aquadata.EndToEndTests.Api.Pond.CreatePond;

[CollectionDefinition(nameof(CreatePondTestFixture))]
public class CreatePondCollection
  : ICollectionFixture<CreatePondTestFixture>
{}

public class CreatePondTestFixture
  :PondTestFixture
{
  public CreatePondInput GetExampleInput(Guid id)
    => new("name", 20f, id);

}
