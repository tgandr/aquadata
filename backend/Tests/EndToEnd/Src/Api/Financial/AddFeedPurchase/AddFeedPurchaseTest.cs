using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.Financial.Common;
using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.EndToEndTests.Api.Financal.AddFeedPurchase;

[Collection(nameof(AddFeedPurchaseTestFixture))]
public class AddPurchaseTest
{
  private readonly AddFeedPurchaseTestFixture _fixture;

  public AddPurchaseTest(AddFeedPurchaseTestFixture fixture)
  {
      _fixture = fixture;
  }

  [Fact]
  public async void AddFeedPurchase()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var input = _fixture.GetInput();

    var (response, _) = await _fixture.ApiClient
    .Post<object>(
      "/financial/add-feed-purchase",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);

    var (_,output) = await _fixture.ApiClient
    .Get<ApiResponse<FinancialOutput>>(
      $"financial"
    );

    Assert.NotNull(output);
    Assert.NotNull(output.Data.FeedPurchases);
    Assert.NotEmpty(output.Data.FeedPurchases);
  }
}
