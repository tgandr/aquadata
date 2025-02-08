using Aquadata.Application.UseCases.Cultivation;
using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Enums;
using Aquadata.EndToEndTests.Api.Base;
using Aquadata.EndToEndTests.Api.Cultivation.Common;

namespace Aquadata.EndToEndTests.Api.Cultivation.CreateCultivation;

[CollectionDefinition(nameof(CreateCultivationTestFixture))]
public class CreateCultivationTestFixture: CultivationFixture, 
ICollectionFixture<CreateCultivationTestFixture>
{
}