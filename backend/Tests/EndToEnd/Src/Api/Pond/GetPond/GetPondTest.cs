using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.Pond.Common;

namespace Aquadata.EndToEndTests.Api.Pond.GetPond;

[Collection(nameof(GetPondFixture))]
public class GetPondTest
{
  private readonly GetPondFixture _fixture;

  public GetPondTest(GetPondFixture fixture)
  {
    _fixture = fixture;
  }
  
  [Fact]
  public async Task GetPond()
  {
    var userExample = _fixture.GetUserExample();
    var credentials = await _fixture.ApiClient.SignUp(userExample);

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
}
