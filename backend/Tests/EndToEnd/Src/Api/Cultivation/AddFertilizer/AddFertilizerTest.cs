using System.Net;

namespace Aquadata.EndToEndTests.Api.Cultivation.AddFertilizer;

[Collection(nameof(AddFertilizerFixture))]
public class AddFertilizerTest
{
  private readonly AddFertilizerFixture _fixture;

  public AddFertilizerTest(AddFertilizerFixture fixture)
    => _fixture = fixture;

  [Fact]
  public async Task AddFertilizer()
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
          "/cultivations/add-fertilizer",
          inputList[i]
        );

      Assert.NotNull(response);
      Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    };

    var cultivationFromDb = await _fixture.Persistence
    .GetById(cultivation.Id);

    Assert.NotNull(cultivationFromDb);
    Assert.NotNull(cultivationFromDb.Fertilizers);
    Assert.Equal(inputList.Count, cultivationFromDb.Fertilizers.Count);
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
      "/cultivations/add-fertilizer",
      input[0]
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
  }
}
