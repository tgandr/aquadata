using Aquadata.Application.Dtos;
using Aquadata.EndToEndTests.Api.Base;
using Aquadata.EndToEndTests.Api.Financial.Common;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.Financal.AddGenericPurchase;

[CollectionDefinition(nameof(AddGenericPurchaseTestFixture))]
public class AddGenericPurchaseTestFixture
:FinancialFixture, ICollectionFixture<AddGenericPurchaseTestFixture>
{
  public GenericPurchaseDto GetInput()
    => new("20/12/2023", "label", 12, 12m, "description");
}
