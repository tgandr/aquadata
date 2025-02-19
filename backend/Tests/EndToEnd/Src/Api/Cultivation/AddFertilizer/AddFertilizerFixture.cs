using Aquadata.Application.UseCases.Cultivation.AddFertilizer;
using Aquadata.Core.Enums;
using Aquadata.EndToEndTests.Api.Cultivation.Common;

namespace Aquadata.EndToEndTests.Api.Cultivation.AddFertilizer;

[CollectionDefinition(nameof(AddFertilizerFixture))]
public class AddFertilizerFixture
:CultivationFixture, ICollectionFixture<AddFertilizerFixture>
{
  public List<AddFertilizerInput> GetInputList(Guid cultivationId)
  {
    var list = new List<AddFertilizerInput>();

    for (int i = 0; i < 2; i++)
    {
      list.Add(new AddFertilizerInput(
        "name"+i,
        DateTime.Now,
        FertilizerType.Bokashi,
        12+i,
        MeasureUnit.Kg,
        cultivationId
      ));
    }

    return list;
  }
}
