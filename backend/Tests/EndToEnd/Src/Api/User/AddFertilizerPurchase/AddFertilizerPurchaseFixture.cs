using Aquadata.Application.UseCases.User.Purchase.AddFertilizerPurchase;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.User.AddFertilizerPurchase;

[CollectionDefinition(nameof(AddFertilizerPurchaseFixture))]
public class AddFertilizerPurchaseFixture
:UserTestFixture,ICollectionFixture<AddFertilizerPurchaseFixture>
{
  public FertilizerPurchaseDto GetInput()
    => new("20/12/2000", "label", 10, 10m, Core.Enums.MeasureUnit.g);
}
