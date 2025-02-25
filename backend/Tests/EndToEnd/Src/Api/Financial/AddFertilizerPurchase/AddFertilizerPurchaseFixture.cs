using Aquadata.Application.Dtos;
using Aquadata.EndToEndTests.Api.Financial.Common;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.Financal.AddFertilizerPurchase;

[CollectionDefinition(nameof(AddFertilizerPurchaseFixture))]
public class AddFertilizerPurchaseFixture
:FinancialFixture,ICollectionFixture<AddFertilizerPurchaseFixture>
{
  public FertilizerPurchaseDto GetInput()
    => new("20/12/2000", "label", 10, 10m, Core.Enums.MeasureUnit.g);
}
