using Aquadata.Application.Dtos;
using Aquadata.Core.Enums;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.User.AddInventory;

[CollectionDefinition(nameof(AddInventoryTestFixture))]
public class AddInventoryTestFixture
:UserTestFixture, ICollectionFixture<AddInventoryTestFixture>
{
  public List<InventoryDto> GetInputList()
  {
    return new List<InventoryDto>{
      new InventoryDto
      (
        "Item1",
        1000,
        2000,
        5,
        ItemStatus.New,
        "2021-01-01"
      ),
      new InventoryDto
      (
        "Item2",
        2000,
        3000,
        10,
        ItemStatus.Used,
        "2021-01-01"
      )
    };
  }
}
