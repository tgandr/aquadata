using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.EndToEndTests.Api.User.GetUser;

[Collection(nameof(GetUserTestFixture))]
public class GetUserTest
{
  private readonly GetUserTestFixture _fixture;

  public GetUserTest(GetUserTestFixture fixture)
  {
    _fixture = fixture;
  }

  [Fact]
  public async void GetUser()
  {
    var userExample = _fixture.GetUserExample();
    await _fixture.Persistence.Insert(userExample);

    var (response, output) = await _fixture.ApiClient
    .Get<ApiResponse<UserOutput>>(
      $"/users/{userExample.Id}"
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    Assert.NotNull(output);

    var dbUser = await _fixture.Persistence.GetById(userExample.Id);

    Assert.Equivalent(output.Data, dbUser);
  }
}
