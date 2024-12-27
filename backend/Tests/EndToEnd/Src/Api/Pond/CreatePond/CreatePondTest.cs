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
    await _fixture.Persistence.AddUser(userExample);

    var input = _fixture.GetExampleInput(userExample.Id);

    var (response, output) = await _fixture
      .ApiClient.Post<ApiResponse<PondOutput>>(
        "/ponds",
        input
      );

    Assert.NotNull(response);
    Assert.Equal(System.Net.HttpStatusCode.Created, response.StatusCode);

    Assert.NotNull(output);
    Assert.NotNull(output.Data);

  }

  public void Dispose()
  {
    _fixture.CleanPersistence();
  }

} 
