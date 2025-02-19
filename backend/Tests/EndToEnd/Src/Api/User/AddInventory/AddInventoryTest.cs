using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.EndToEndTests.Api.User.AddInventory;

[Collection(nameof(AddInventoryTestFixture))]
public class AddInventoryTest
{
  private readonly AddInventoryTestFixture _fixture;

  public AddInventoryTest(AddInventoryTestFixture fixture)
  {
    _fixture = fixture;
  }

  [Fact]
  public async Task AddInventory()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var inputList = _fixture.GetInputList();
    
    foreach (var input in inputList)
    {
      var (response, _) = await _fixture.ApiClient
        .Post<object>(
        "/users/add-inventory",
        input
      );
      Assert.NotNull(response);
      Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    var (_,output) = await _fixture.ApiClient
    .Get<ApiResponse<UserOutput>>(
      $"users/{credentials.User.Id}"
    );

    Assert.NotNull(output);
    Assert.NotNull(output.Data.Inventories);
    Assert.NotEmpty(output.Data.Inventories);
  }
}
