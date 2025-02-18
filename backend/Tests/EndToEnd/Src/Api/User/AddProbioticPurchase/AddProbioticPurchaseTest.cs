using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.EndToEndTests.Api.User.AddProbioticPurchase;

[Collection(nameof(AddProbioticPurchaseTestFixture))]
public class AddProbioticPurchaseTest
{
  private readonly AddProbioticPurchaseTestFixture _fixture;

  public AddProbioticPurchaseTest(AddProbioticPurchaseTestFixture fixture)
  {
      _fixture = fixture;
  }

  [Fact]
  public async void AddProbioticPurchase()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var input = _fixture.GetInput();

    var (response, _) = await _fixture.ApiClient
    .Post<object>(
      "/financial/add-probiotic-purchase",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);

    var (_,output) = await _fixture.ApiClient
    .Get<ApiResponse<UserOutput>>(
      $"users/{credentials.User.Id}"
    );
    Assert.NotNull(output);
    Assert.NotNull(output.Data.ProbioticPurchases);
    Assert.NotEmpty(output.Data.ProbioticPurchases);
  }
}
