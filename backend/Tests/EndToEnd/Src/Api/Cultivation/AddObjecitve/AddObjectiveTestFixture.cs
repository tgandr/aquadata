using Aquadata.Application.UseCases.Cultivation.AddObjective;
using Aquadata.EndToEndTests.Api.Base;
using Aquadata.EndToEndTests.Api.Cultivation.Common;

namespace Aquadata.EndToEndTests.Api.Cultivation.AddObjecitve;

[CollectionDefinition(nameof(AddObjectiveTestFixture))]
public class AddObjectiveTestFixture
:CultivationFixture, ICollectionFixture<AddObjectiveTestFixture>
{
  public AddObjectiveInput GetInput(Guid cultivationId)
    => new(10,10f,10f,cultivationId);
}
