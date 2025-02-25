using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Core.Entities.Cultivation;

namespace Aquadata.EndToEndTests.Api.Pond.GetPond;

[Collection(nameof(GetPondFixture))]
public class GetPondTest: IDisposable
{
  private readonly GetPondFixture _fixture;

  public GetPondTest(GetPondFixture fixture)
  {
    _fixture = fixture;
  }

  [Fact]
  public async Task GetPond()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var pondExample = _fixture.GetPondExample(credentials.User.Id);

    await _fixture.Persistence.Insert(pondExample);

    var (response, output) = await _fixture.ApiClient
    .Get<ApiResponse<PondOutput>>(
      $"/ponds/{pondExample.Id}"
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    var pondDb = await _fixture.Persistence.GetById(pondExample.Id);

    Assert.NotNull(pondDb);
    Assert.NotNull(output);
    Assert.Equivalent(output.Data, pondDb);
  }

  [Fact]
  public async Task GetPondList()
  {
    var credentials = await _fixture.ApiClient.SignUp();

    for (int i = 0; i < 5; i++)
    {
      await _fixture.Persistence.Insert(_fixture
        .GetPondExample(credentials.User.Id));
    }

    var (response, output) = await _fixture.ApiClient
    .Get<ApiResponse<ICollection<PondOutput>>>(
      $"/ponds"
    );

    Assert.NotNull(response);
    Assert.NotNull(output);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    Assert.Equal(5, output.Data.Count);
  }

  [Fact]
  public async Task GetPondWithCultivation()
  {
    var credentials = await _fixture.ApiClient.SignUp();
  
    var pondExample = _fixture.GetPondExample(credentials.User.Id);
    var cultivation = CultivationEntity.Of(1,1,"Pl", false, 
    Core.Enums.CultivationUniformity.Acceptable, DateTime.Now).Unwrap();
    cultivation.PondId = pondExample.Id;

    await _fixture.Persistence.Insert(pondExample);
    await _fixture.Persistence.Insert(cultivation);

    var (response, output) = await _fixture.ApiClient
    .Get<ApiResponse<PondOutput>>(
      $"/ponds/{pondExample.Id}"
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    Assert.NotNull(output);
    Assert.Single(output.Data.Cultivations!);
  }

  [Fact]
  public async Task UnauthorizedTest()
  {
    var userExample = _fixture.Persistence.GetUserExample();
    var pondExample = _fixture.GetPondExample(userExample.Id);

    await _fixture.ApiClient.SignUp();
    await _fixture.Persistence.Insert(userExample);
    await _fixture.Persistence.Insert(pondExample);

    var (response, _) = await _fixture
      .ApiClient.Get<ApiResponse<PondOutput>>(
        $"/ponds/{pondExample.Id}");

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }

  [Fact]
  public async Task NotFoundTest()
  {
    var userExample = _fixture.Persistence.GetUserExample();
    await _fixture.ApiClient.SignUp();

    var (response, _) = await _fixture
      .ApiClient.Get<ApiResponse<PondOutput>>(
        $"/ponds/{userExample.Id}");

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
  }


  public void Dispose()
  {
    _fixture.CleanPersistence();
  }
}
