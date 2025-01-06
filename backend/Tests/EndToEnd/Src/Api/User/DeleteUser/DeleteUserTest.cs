using System.Net;
using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.EndToEndTests.Api.User.DeleteUser;

[Collection(nameof(DeleteUserFixture))]
public class DeleteUserTest
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
    await _fixture.Persistence.Insert(example);

    var (response, output) = await _fixture.ApiClient
      .Delete<object>(
        $"/users/{example.Id}"
      );
    
    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    Assert.Null(output);

    var dbUser = await _fixture.Persistence.GetById(example.Id);

    Assert.Null(dbUser);
  }
}
