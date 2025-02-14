using System.Net;

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
      "/users/add-probiotic-purchase",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);

    var userFromDb = await _fixture.Persistence.GetById(credentials.User.Id);

    Assert.NotNull(userFromDb);
    Assert.NotNull(userFromDb.ProbioticPurchases);
    Assert.NotEmpty(userFromDb.ProbioticPurchases);
  }
}
