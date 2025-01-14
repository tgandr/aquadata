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
    var userExample = _fixture.GetUserExample();
    var credentials = await _fixture.ApiClient.SignUp(userExample);
    var input = _fixture.GetExampleInput(credentials.User.Id);

    var (response, output) = await _fixture.ApiClient
      .Put<ApiResponse<UserOutput>>(
        "/users",
        input
      );
  
    Assert.NotNull(response);
    Assert.Equal(System.Net.HttpStatusCode.OK, response.StatusCode);
    Assert.NotNull(output);

    var dbUser = await _fixture.Persistence.GetById(credentials.User.Id);

    Assert.NotNull(dbUser);
    Assert.Equivalent(input, dbUser);
  }


  public void Dispose()
   => _fixture.CleanPersistence();
}
