using Aquadata.Application.Dtos;
using Aquadata.Application.UseCases.Cultivation.AddHarvest;
using Aquadata.EndToEndTests.Api.Cultivation.Common;

namespace Aquadata.EndToEndTests.Api.Cultivation.AddHarvest;

[CollectionDefinition(nameof(AddHarvestTestFixture))]
public class AddHarvestTestFixture
:CultivationFixture, ICollectionFixture<AddHarvestTestFixture>
{
  public List<AddHarvestInput> GetInputList(Guid cultivationId)
  {
    var list = new List<AddHarvestInput>();
    var biometricList = new List<BiometricDto>
    {
        new BiometricDto(2f, 3f, DateTime.Now),
        new BiometricDto(2f, 3f, DateTime.Now)
    };

    for (int i = 0; i < 2; i++)
    {
      list.Add(new AddHarvestInput(
        buyer: "teste"+i,
        price: 24.5m,
        date: DateTime.Now,
        isTotal: true,
        bioMass: 35f,
        biometricList,
        cultivationId
      ));
    }

    return list;
  }   
}
