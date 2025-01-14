using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.EndToEndTests.Api.User.GetUser;

[Collection(nameof(GetUserTestFixture))]
public class GetUserTest: IDisposable
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
    var credentials = await _fixture.ApiClient.SignUp(userExample);

    var (response, output) = await _fixture.ApiClient
    .Get<ApiResponse<UserOutput>>(
      $"/users/{credentials.User.Id}"
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    Assert.NotNull(output);

    var dbUser = await _fixture.Persistence.GetById(credentials.User.Id);

    Assert.Equivalent(output.Data, dbUser);
  }

  public void Dispose()
   => _fixture.CleanPersistence();
}
