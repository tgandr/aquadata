using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.Pond.Common;

namespace Aquadata.EndToEndTests.Api.Pond.DeactivatePond;

[Collection(nameof(DeactivatePondFixture))]
public class DeactivatePondTest: IDisposable
{
  private readonly DeactivatePondFixture _fixture;

  public DeactivatePondTest(DeactivatePondFixture fixture)
  {
    _fixture = fixture;
  }

  [Fact]
  public async Task DeactivatePond()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var pondExample = _fixture.GetPondExample(credentials.User.Id);

    await _fixture.Persistence.Insert(pondExample);

    var (response, output) = await _fixture.ApiClient
      .Delete<ApiResponse<PondOutput>>(
        $"/ponds/deactivate/{pondExample.Id}"
      );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    Assert.NotNull(output);
    var pondDb = await _fixture.Persistence.GetById(pondExample.Id);

    Assert.NotNull(pondDb);
    Assert.False(pondDb.IsActive);
  }

  public void Dispose()
  {
    _fixture.CleanPersistence();
  }
}
