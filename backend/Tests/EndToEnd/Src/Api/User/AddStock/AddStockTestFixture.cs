using Aquadata.Application.Dtos;
using Aquadata.Core.Enums;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.User.AddStock;

[CollectionDefinition(nameof(AddStockTestFixture))]
public class AddStockTestFixture
:UserTestFixture, ICollectionFixture<AddStockTestFixture>
{
  public StockDto GetInput()
    => new("label", SupplyType.Fertilizer, 10);
}
