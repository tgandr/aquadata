using Aquadata.Application.UseCases.Cultivation.AddFeed;
using Aquadata.EndToEndTests.Api.Cultivation.Common;

namespace Aquadata.EndToEndTests.Api.Cultivation.AddFeed;

[CollectionDefinition(nameof(AddFeedTestFixture))]
public class AddFeedTestFixture
:CultivationFixture, ICollectionFixture<AddFeedTestFixture>
{
  public List<AddFeedInput> GetInputList(Guid cultivationId)
  {
    var list = new List<AddFeedInput>();

    for (int i = 0; i < 2; i++)
    {
      list.Add(new AddFeedInput(
        DateTime.Now,
        34,
        34f,
        "name",
        false,
        false,
        cultivationId
      ));
    }

    return list;
  }
}
