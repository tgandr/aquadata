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

    var (response,_) = await _fixture.ApiClient
      .Post<ApiResponse<PondOutput>>(
      "/cultivations",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);
  }
  [Fact]
  public async Task NotFound()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var pond = _fixture.GetPondExample(credentials.User.Id);
    var input = _fixture.GetExampleInput(pond.Id);

    var (response,_) = await _fixture.ApiClient
      .Post<ApiResponse<PondOutput>>(
      "/cultivations",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
  }

  public void Dispose()
  {
    _fixture.CleanPersistence();
  }
}
