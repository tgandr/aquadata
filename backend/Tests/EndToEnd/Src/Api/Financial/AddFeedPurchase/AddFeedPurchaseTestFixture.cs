using Aquadata.Application.UseCases.Financial.AddFeedPurchase;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.Financal.AddFeedPurchase;

[CollectionDefinition(nameof(AddFeedPurchaseTestFixture))]
public class AddFeedPurchaseTestFixture
:UserTestFixture, ICollectionFixture<AddFeedPurchaseTestFixture>
{
  public AddFeedPurchaseInput GetInput()
    => new("20/12/2000","label", 10, 10m, "brand", "10/10/2000", 10,"type");
}
