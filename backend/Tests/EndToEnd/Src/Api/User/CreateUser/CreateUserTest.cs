using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.User.Common;

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
      .ApiClient.Post<ApiResponse<UserOutput>>(
        "/users",
        input
      );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    Assert.NotNull(output);
    Assert.Equivalent(input, output.Data);

    var dbUser = await _fixture.Persistence.GetById(output.Data.Id);

    Assert.NotNull(dbUser);
    Assert.Equivalent(input, dbUser);
  }

  public void Dispose()
  {
    _fixture.CleanPersistence();
  }
}
