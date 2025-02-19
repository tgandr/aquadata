using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.Pond.Common;

namespace Aquadata.EndToEndTests.Api.Pond.UpdatePond;

[Collection(nameof(UpdatePondFixture))]
public class UpdatePondTest: IDisposable
{
  private readonly UpdatePondFixture _fixture;

  public UpdatePondTest(UpdatePondFixture fixture)
  {
    _fixture = fixture;
  }
  [Fact]
  public async Task UpdatePond()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var pondExample = _fixture.GetPondExample(credentials.User.Id);
    var input = _fixture.GetInput(pondExample.Id);
    
    await _fixture.Persistence.Insert(pondExample);

    var (response, output) = await _fixture.ApiClient
      .Put<ApiResponse<PondOutput>>(
        "/ponds",
        input
      );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    var pondDb = await _fixture.Persistence.GetById(pondExample.Id);
    Assert.NotNull(output);
    Assert.NotNull(pondDb);
    Assert.Equivalent(output.Data, pondDb);
  }

  [Fact]
  public async Task UnauthorizedTest()
  {
    var userExample = _fixture.Persistence.GetUserExample();
    var pondExample = _fixture.GetPondExample(userExample.Id);
    var input = _fixture.GetInput(pondExample.Id);
    await _fixture.ApiClient.SignUp();
    await _fixture.Persistence.Insert(userExample);
    await _fixture.Persistence.Insert(pondExample);

    var (response, _) = await _fixture
      .ApiClient.Put<ApiResponse<PondOutput>>(
        "/ponds/",
        input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }
  [Fact]
  public async Task NotFoundTest()
  {
    var userExample = _fixture.Persistence.GetUserExample();
    var pondExample = _fixture.GetPondExample(userExample.Id);
    var input = _fixture.GetInput(pondExample.Id);
    await _fixture.ApiClient.SignUp();

    var (response, _) = await _fixture
      .ApiClient.Put<ApiResponse<PondOutput>>(
        "/ponds/",
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
