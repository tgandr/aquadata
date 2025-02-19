using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.Dtos;

namespace Aquadata.EndToEndTests.Api.Cultivation.AddObjecitve;

[Collection(nameof(AddObjectiveTestFixture))]
public class AddObjectiveTest: IDisposable
{
  private readonly AddObjectiveTestFixture _fixture;
  
  public AddObjectiveTest(AddObjectiveTestFixture fixture)
    => _fixture = fixture;

  [Fact]
  public async Task AddObjective()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var pond = _fixture.GetPondExample(credentials.User.Id);
    var cultivation = _fixture.GetCultivationExample(pond.Id);
    var input = _fixture.GetInput(cultivation.Id);

    await _fixture.Persistence.Insert(pond);
    await _fixture.Persistence.Insert(cultivation);

    var (response,output) = await _fixture.ApiClient
    .Post<ApiResponse<ObjectiveDto>>(
      "/cultivations/add-objective",
      input
    );

    Assert.NotNull(response);
    Assert.NotNull(output);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    var cultivationFromDb = await _fixture.Persistence.GetById(cultivation.Id);

    Assert.NotNull(cultivationFromDb);
    Assert.NotNull(cultivationFromDb.Objective);
    Assert.Equivalent(input, cultivationFromDb.Objective);
  }
  
  [Fact]
  public async Task NotFound()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var pond = _fixture.GetPondExample(credentials.User.Id);
    var cultivation = _fixture.GetCultivationExample(pond.Id);
    var input = _fixture.GetInput(cultivation.Id);

    var (response,_) = await _fixture.ApiClient
    .Post<object>(
      "/cultivations/add-objective",
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
