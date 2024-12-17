using Aquadata.Application.UseCases.Pond.CreatePond;

namespace Aquadata.UnitTests.Application.Pond;

[CollectionDefinition(nameof(CreatePondTestFixture))]
public class CreatePondTestFixture: ICollectionFixture<CreatePondTestFixture>
{

  public CreatePondInput GetInput()
    => new("name",10f);
}
