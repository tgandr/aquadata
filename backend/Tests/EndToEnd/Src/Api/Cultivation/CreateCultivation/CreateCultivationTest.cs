using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.Pond.Common;

namespace Aquadata.EndToEndTests.Api.Cultivation.CreateCultivation;

[Collection(nameof(CreateCultivationTestFixture))]
public class CreateCultivationTest: IDisposable
{
  private readonly CreateCultivationTestFixture _fixture;

  public CreateCultivationTest(CreateCultivationTestFixture fixture)
  {
    _fixture = fixture;
  }   

  [Fact]
  public async Task CreateCultivation()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var pond = _fixture.GetPondExample(credentials.User.Id);
    var input = _fixture.GetExampleInput(pond.Id);

    await _fixture.Persistence.Insert(pond);

    var (response,output) = await _fixture.ApiClient
      .Post<ApiResponse<PondOutput>>(
      "/cultivations",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);
  }

  public void Dispose()
  {
    _fixture.CleanPersistence();
  }
}
