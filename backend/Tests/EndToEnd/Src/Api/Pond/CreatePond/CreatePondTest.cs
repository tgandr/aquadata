using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.Pond.Common;

namespace Aquadata.EndToEndTests.Api.Pond.CreatePond;

[Collection(nameof(CreatePondTestFixture))]
public class CreatePondTest
  :IDisposable
{
  private readonly CreatePondTestFixture _fixture;

  public CreatePondTest(CreatePondTestFixture fixture)
    => _fixture = fixture;
  

  [Fact]
  public async Task CreatePond()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    
    var input = _fixture.GetExampleInput(credentials.User.Id);

    var (response, output) = await _fixture
      .ApiClient.Post<ApiResponse<PondOutput>>(
        "/ponds",
        input
      );

    Assert.NotNull(response);
    Assert.NotNull(output);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);

    var dbPond = await _fixture.Persistence.GetById(output.Data.Id);

    Assert.Equivalent(input, dbPond);
  }

  [Fact]
  public async Task UnauthorizedTest()
  {
    var userExample = _fixture.Persistence.GetUserExample();
    await _fixture.ApiClient.SignUp();
    await _fixture.Persistence.Insert(userExample);
    var input = _fixture.GetExampleInput(userExample.Id);

    var (response, _) = await _fixture
      .ApiClient.Post<ApiResponse<PondOutput>>(
        "/ponds",
        input
      );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }

  public void Dispose()
  {
    _fixture.CleanPersistence();
  }

} 
