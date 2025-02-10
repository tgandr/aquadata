using System.Net;
using Aquadata.Api.Response;

namespace Aquadata.EndToEndTests.Api.Cultivation.AddWaterParam;

[Collection(nameof(AddWaterParamFixture))]
public class AddWaterParamTest
{
  private readonly AddWaterParamFixture _fixture;

  public AddWaterParamTest(AddWaterParamFixture fixture)
    => _fixture = fixture;

  [Fact]
  public async Task AddWaterParam()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var pondExample = _fixture.GetPondExample(credentials.User.Id);
    var cultivationExample = _fixture.GetCultivationExample(pondExample.Id);
    var inputList = _fixture.GetInputList(cultivationExample.Id);

    await _fixture.Persistence.Insert(pondExample);
    await _fixture.Persistence.Insert(cultivationExample);

    for (int i = 0; i < inputList.Count; i++){
      var (response, _) = await _fixture.ApiClient
        .Post<object>(
          "/cultivations/add-water-param",
          inputList[i]
        );

      Assert.NotNull(response);
      Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    };

    var cultivationFromDb = await _fixture.Persistence
    .GetById(cultivationExample.Id);

    Assert.NotNull(cultivationFromDb);
    Assert.NotNull(cultivationFromDb.WaterParams);
    Assert.Equal(inputList.Count, cultivationFromDb.WaterParams.Count);
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
      "/cultivations/add-water-param",
      input[0]
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
  }
}
