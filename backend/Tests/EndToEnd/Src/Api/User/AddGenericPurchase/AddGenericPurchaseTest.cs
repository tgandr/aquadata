using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.EndToEndTests.Api.User.AddGenericPurchase;

[Collection(nameof(AddGenericPurchaseTestFixture))]
public class AddGenericPurchaseTest
{
  private readonly AddGenericPurchaseTestFixture _fixture;

  public AddGenericPurchaseTest(AddGenericPurchaseTestFixture fixture)
    => _fixture = fixture;
  
  [Fact]
  public async void AddGenericPurchase()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var input = _fixture.GetInput();

    var (response, _) = await _fixture.ApiClient
    .Post<object>(
      "/financial/add-generic-purchase",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);

    var (_, output) = await _fixture.ApiClient
    .Get<ApiResponse<UserOutput>>(
      $"/users/{credentials.User.Id}"
    );

    Assert.NotNull(output);
    Assert.NotNull(output.Data.GenericPurchases);
    Assert.NotEmpty(output.Data.GenericPurchases);
  }
}
