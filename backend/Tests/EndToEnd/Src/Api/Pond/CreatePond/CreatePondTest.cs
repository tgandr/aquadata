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
    var userExample = _fixture.GetUserExample();
    var credentials = await _fixture.ApiClient.SignUp(userExample);
    
    var input = _fixture.GetExampleInput(credentials.User.Id);

    var (response, output) = await _fixture
      .ApiClient.Post<ApiResponse<PondOutput>>(
        "/ponds",
        input
      );

    Assert.NotNull(response);
    Assert.NotNull(output);
    Assert.Equal(System.Net.HttpStatusCode.Created, response.StatusCode);

    var dbPond = await _fixture.Persistence.GetById(output.Data.Id);

    Assert.Equivalent(input, dbPond);
  }

  public void Dispose()
  {
    _fixture.CleanPersistence();
  }

} 
