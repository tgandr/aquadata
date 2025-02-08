using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.User.Common;
using Microsoft.AspNetCore.Mvc;

namespace Aquadata.EndToEndTests.Api.User.UpdateUser;

[Collection(nameof(UpdateUserTestFixture))]
public class UpdateUserTest: IDisposable
{
  private readonly UpdateUserTestFixture _fixture;

  public UpdateUserTest(UpdateUserTestFixture fixture)
  {
    _fixture = fixture;
  }

  [Fact]
  public async void UpdateUser()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var input = _fixture.GetExampleInput(credentials.User.Id);

    var (response, output) = await _fixture.ApiClient
      .Put<ApiResponse<UserOutput>>(
        "/users",
        input
      );
  
    Assert.NotNull(response);
    Assert.NotNull(output);
    Assert.Equal(System.Net.HttpStatusCode.OK, response.StatusCode);

    var dbUser = await _fixture.Persistence.GetById(credentials.User.Id);

    Assert.NotNull(dbUser);
    Assert.Equivalent(input, dbUser);
  }

  [Fact]
  public async void UnauthorizedTest()
  {
    var userExample = _fixture.GetUserExample();
    await _fixture.ApiClient.SignUp();
    var input = _fixture.GetExampleInput(userExample.Id);

    await _fixture.Persistence.Insert(userExample);

    var (response, _) = await _fixture.ApiClient
      .Put<ApiResponse<UserOutput>>(
        "/users",
        input
      );
    
    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }
  [Fact]
  public async void NotFound()
  {
    var userExample = _fixture.GetUserExample();
    await _fixture.ApiClient.SignUp();
    var input = _fixture.GetExampleInput(userExample.Id);

    var (response, _) = await _fixture.ApiClient
      .Put<ApiResponse<UserOutput>>(
        "/users",
        input
      );
    
    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
  }

  public void Dispose()
   => _fixture.CleanPersistence();
}
