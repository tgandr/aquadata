using Aquadata.EndToEndTests.Api.Pond.Common;

namespace Aquadata.EndToEndTests.Api.Pond.GetPond;

[CollectionDefinition(nameof(GetPondFixture))]
public class GetPondFixture: PondTestFixture
, ICollectionFixture<GetPondFixture>
{
}
