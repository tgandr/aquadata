using System.Net;

namespace Aquadata.EndToEndTests.Api.User.AddFertilizerPurchase;

[Collection(nameof(AddFertilizerPurchaseFixture))]
public class AddFertilizerPurchaseTest
{
  private readonly AddFertilizerPurchaseFixture _fixture;

  public AddFertilizerPurchaseTest(AddFertilizerPurchaseFixture fixture)
    => _fixture = fixture;
  
  [Fact]
  public async void AddFertilizerPurchase()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var input = _fixture.GetInput();

    var (response, _) = await _fixture.ApiClient
    .Post<object>(
      "/users/add-fertilizer-purchase",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);

    var userFromDb = await _fixture.Persistence.GetById(credentials.User.Id);

    Assert.NotNull(userFromDb);
    Assert.NotNull(userFromDb.FertilizerPurchases);
    Assert.NotEmpty(userFromDb.FertilizerPurchases);
  }
}
