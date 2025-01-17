using System.Net;
using Aquadata.Api.Models;
using Aquadata.Api.Response;

namespace Aquadata.EndToEndTests.Api.User.CreateUser;

[Collection(nameof(CreateUserTestFixture))]
public class CreateUserTest: IDisposable
{
  private readonly CreateUserTestFixture _fixture;

  public CreateUserTest(CreateUserTestFixture fixture)
    => _fixture = fixture;

  [Fact]
  public async Task CreateUser()
  {
    var input = _fixture.GetExampleInput();
    
    var (response, output) = await _fixture
      .ApiClient.Post<ApiResponse<UserApiOutput>>(
        "/users/signup",
        input
      );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    Assert.NotNull(output);
    Assert.NotNull(output.Data.Token);

    var dbUser = await _fixture.Persistence.GetById(output.Data.User.Id);

    Assert.NotNull(dbUser);
    Assert.Equivalent(output.Data.User, dbUser);
  }

  public void Dispose()
  {
    _fixture.CleanPersistence();
  }
}
