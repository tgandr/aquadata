using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.EndToEndTests.Api.Financal.AddPLPurchase;

[Collection(nameof(AddPLPurchaseTestFixture))]
public class AddPLPurchaseTest
{
  private readonly AddPLPurchaseTestFixture _fixture;

  public AddPLPurchaseTest(AddPLPurchaseTestFixture fixture)
    => _fixture = fixture;
  
  [Fact]
  public async void AddPLPurchase()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var pond = _fixture.GetPondExample(credentials.User.Id);
    var cultivation =  _fixture.GetCultivationExample(pond.Id);

    await _fixture.Persistence.Insert(pond);
    await _fixture.Persistence.Insert(cultivation);

    var input = _fixture.GetInput(credentials.User.Id, cultivation.Id);

    var (response, _) = await _fixture.ApiClient
    .Post<object>(
      "/financial/add-post-larvae-purchase",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);

    var (_,output) = await _fixture.ApiClient
    .Get<ApiResponse<UserOutput>>(
      $"users/{credentials.User.Id}"
    );

    Assert.NotNull(output);
    Assert.NotNull(output.Data.PLPurchases);
    Assert.NotEmpty(output.Data.PLPurchases);
  }
}
