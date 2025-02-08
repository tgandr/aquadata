using Aquadata.Application.UseCases.Cultivation.AddBiometric;
using Aquadata.EndToEndTests.Api.Cultivation.Common;

namespace Aquadata.EndToEndTests.Api.Cultivation.AddBiometric;

[CollectionDefinition(nameof(AddBiometricTestFixture))]
public class AddBiometricTestFixture: 
CultivationFixture, ICollectionFixture<AddBiometricTestFixture>
{
  public AddBiometricInput GetInput(Guid cultivationId)
    => new(2f, 10f, DateTime.Now, cultivationId);
}
