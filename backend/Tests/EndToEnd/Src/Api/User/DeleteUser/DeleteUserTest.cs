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
    var credentials = await _fixture.ApiClient.SignUp();

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

  [Fact]
  public async void NotFoundTest()
  {
    await _fixture.ApiClient.SignUp();

    var (response,_) = await _fixture.ApiClient
      .Delete<object>(
        $"/users/{Guid.NewGuid()}"
      );
    
    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
  }
  
  [Fact]
  public async void UnauthorizedTest()
  {
    var userExample = _fixture.GetUserExample();
    await _fixture.ApiClient.SignUp();
    await _fixture.Persistence.Insert(userExample);
    var (response,_) = await _fixture.ApiClient
      .Delete<object>(
        $"/users/{userExample.Id}"
      );
    
    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }

  public void Dispose()
   => _fixture.CleanPersistence();
}
