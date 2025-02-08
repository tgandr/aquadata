using System.Net;

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

    var (response,_) = await _fixture.ApiClient
    .Post<object>(
      "/cultivations/add-objective",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);

    var cultivationFromDb = await _fixture.Persistence.GetById(cultivation.Id);

    Assert.NotNull(cultivationFromDb);
    Assert.NotNull(cultivationFromDb.Objective);
    Assert.Equivalent(input, cultivationFromDb.Objective);
  }

  public void Dispose()
  {
    _fixture.CleanPersistence();
  }
}
