using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.Pond.Common;

namespace Aquadata.EndToEndTests.Api.Pond.UpdatePond;

[Collection(nameof(UpdatePondFixture))]
public class UpdatePondTest
{
  private readonly UpdatePondFixture _fixture;

  public UpdatePondTest(UpdatePondFixture fixture)
  {
    _fixture = fixture;
  }
  [Fact]
  public async Task UpdatePond()
  {
    var userExample = _fixture.GetUserExample();
    var pondExample = _fixture.GetPondExample(userExample.Id);
    var input = _fixture.GetInput(pondExample.Id);

    await _fixture.Persistence.AddUser(userExample);
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
    Assert.Equivalent(output.Data, pondDb);
  }
}
