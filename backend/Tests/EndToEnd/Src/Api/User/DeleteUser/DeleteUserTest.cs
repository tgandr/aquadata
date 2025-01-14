using System.Net;

namespace Aquadata.EndToEndTests.Api.User.DeleteUser;

[Collection(nameof(DeleteUserFixture))]
public class DeleteUserTest: IDisposable
{
  private readonly DeleteUserFixture _fixture;

  public DeleteUserTest(DeleteUserFixture fixture)
  {
    _fixture = fixture;
  }

  [Fact]
  public async void DeleteUser()
  {
    var example = _fixture.GetUserExample();
    var credentials = await _fixture.ApiClient.SignUp(example);

    var (response, output) = await _fixture.ApiClient
      .Delete<object>(
        $"/users/{credentials.User.Id}"
      );
    
    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    Assert.Null(output);

    var dbUser = await _fixture.Persistence.GetById(credentials.User.Id);

    Assert.Null(dbUser);
  }

  public void Dispose()
   => _fixture.CleanPersistence();
}
