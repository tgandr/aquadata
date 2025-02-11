using System.Net;

namespace Aquadata.EndToEndTests.Api.Cultivation.AddHarvest;

[Collection(nameof(AddHarvestTestFixture))]
public class AddHarvestTest
{
  private readonly AddHarvestTestFixture _fixture;
  public AddHarvestTest(AddHarvestTestFixture fixture)
    => _fixture = fixture;

  [Fact]
  public async Task AddHarvest()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var pond = _fixture.GetPondExample(credentials.User.Id);
    var cultivation = _fixture.GetCultivationExample(pond.Id);
    var inputList = _fixture.GetInputList(cultivation.Id);

    await _fixture.Persistence.Insert(pond);
    await _fixture.Persistence.Insert(cultivation);

    for (int i = 0; i < inputList.Count; i++){
      var (response, _) = await _fixture.ApiClient
        .Post<object>(
          "/cultivations/add-harvest",
          inputList[i]
        );

      Assert.NotNull(response);
      Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    };

    var cultivationFromDb = await _fixture.Persistence
    .GetById(cultivation.Id);

    Assert.NotNull(cultivationFromDb);
    Assert.NotNull(cultivationFromDb.Harvests);
    Assert.Equal(inputList.Count, cultivationFromDb.Harvests.Count);
    
    foreach (var harvest in cultivation.Harvests)
    {
      Assert.NotEmpty(harvest.Biometrics);
    }
    
  }

  [Fact]
  public async Task NotFound()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var pond = _fixture.GetPondExample(credentials.User.Id);
    var cultivation = _fixture.GetCultivationExample(pond.Id);
    var input = _fixture.GetInputList(cultivation.Id);

    var (response,_) = await _fixture.ApiClient
    .Post<object>(
      "/cultivations/add-harvest",
      input[0]
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
  }
}
