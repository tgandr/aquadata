using System.Net;

namespace Aquadata.EndToEndTests.Api.User.AddFeedPurchase;

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
      "/users/add-feed-purchase",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    var userFromDb = await _fixture.Persistence.GetById(credentials.User.Id);

    Assert.NotNull(userFromDb);
    Assert.NotNull(userFromDb.FeedPurchases);
    Assert.NotEmpty(userFromDb.FeedPurchases);
  }
}
