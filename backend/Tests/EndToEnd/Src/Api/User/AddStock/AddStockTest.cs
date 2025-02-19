using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.EndToEndTests.Api.User.AddStock;

[Collection(nameof(AddStockTestFixture))]
public class AddStockTest
{
  private readonly AddStockTestFixture _fixture;

  public AddStockTest(AddStockTestFixture fixture)
  {
    _fixture = fixture;
  }

  [Fact]
  public async Task AddStock()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var input = _fixture.GetInput();

    var (response, _) = await _fixture.ApiClient
    .Post<object>(
      "/users/add-stock",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);

    var (_,output) = await _fixture.ApiClient
    .Get<ApiResponse<UserOutput>>(
      $"users/{credentials.User.Id}"
    );

    Assert.NotNull(output);
    Assert.NotNull(output.Data.Stocks);
    Assert.NotEmpty(output.Data.Stocks);
  }
}
