using Aquadata.Application.UseCases.Cultivation.AddBiometric;
using Aquadata.EndToEndTests.Api.Cultivation.Common;

namespace Aquadata.EndToEndTests.Api.Cultivation.AddBiometric;

[CollectionDefinition(nameof(AddBiometricTestFixture))]
public class AddBiometricTestFixture: 
CultivationFixture, ICollectionFixture<AddBiometricTestFixture>
{
  public List<AddBiometricInput> GetInputList(Guid cultivationId)
  {
    var list = new List<AddBiometricInput>();
    for (int i = 0; i < 2; i++)
    {
      list.Add(new(2f+i, 10f+i, DateTime.Now, cultivationId));
    }

    return list;
  }
}
