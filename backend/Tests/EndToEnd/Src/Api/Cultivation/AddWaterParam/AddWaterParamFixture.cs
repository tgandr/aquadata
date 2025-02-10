using Aquadata.Application.UseCases.Cultivation.AddWater;
using Aquadata.Core.ValueObjects;
using Aquadata.EndToEndTests.Api.Cultivation.Common;

namespace Aquadata.EndToEndTests.Api.Cultivation.AddWaterParam;

[CollectionDefinition(nameof(AddWaterParamFixture))]
public class AddWaterParamFixture
:CultivationFixture, ICollectionFixture<AddWaterParamFixture>
{
  public List<AddWaterInput> GetInputList(Guid cultivationId)
  {
    var list = new List<AddWaterInput>();
    
    for (int i = 0; i < 2; i++)
    {
      list.Add(
        new(
          date: DateTime.Now, 
          temperature: 20+i, 
          dissolvedOxygen: 25f+i,
          totalAmmonia: 25f+i,
          pH: 2, 
          cultivationId
      ));
    }
    return list;
  }
}
