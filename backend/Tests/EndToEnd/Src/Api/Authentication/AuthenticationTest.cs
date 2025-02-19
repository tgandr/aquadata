using System.Net;
using System.Net.Http.Headers;
using Aquadata.Api.Models;

namespace Aquadata.EndToEndTests.Api.Authorization;

[Collection(nameof(AuthenticationTestFixture))]
public class AuthenticationTest
{
  private readonly AuthenticationTestFixture _fixture;
  public AuthenticationTest(AuthenticationTestFixture fixture)
  {
    _fixture = fixture;
  }
  
  private HttpMethod ToHttpMethod(string method)
  => method switch 
  {
    "GET" => HttpMethod.Get,
    "POST" => HttpMethod.Post,
    "PUT" => HttpMethod.Put,
    "DELETE" => HttpMethod.Delete,
    _ => throw new Exception("Invalid Method")  
  };

  
  [Theory]
  [InlineData("/users", "PUT")]
  [InlineData("/users/add-stock", "POST")]
  [InlineData("/users/add-inventory", "POST")]
  [InlineData("/users/0", "GET")]
  [InlineData("/users/0", "DELETE")]
  [InlineData("/financial/add-fertilizer-purchase", "POST")]
  [InlineData("/financial/add-probiotic-purchase", "POST")]
  [InlineData("/financial/add-feed-purchase", "POST")]
  [InlineData("/financial/add-post-larvae-purchase", "POST")]
  [InlineData("/financial/add-generic-purchase", "POST")]
  [InlineData("/financial/add-expense", "POST")]
  [InlineData("/ponds", "POST")]
  [InlineData("/ponds", "PUT")]
  [InlineData("/ponds/0", "GET")]
  [InlineData("/ponds/deactivate/0", "DELETE")]
  [InlineData("/cultivations", "POST")]
  [InlineData("/cultivations/add-objective", "POST")]
  public async Task UnauthenticatedUser(string route, string method)
  {
    HttpRequestMessage request = new(ToHttpMethod(method), route);
    request.Headers.Authorization = 
      new AuthenticationHeaderValue("Bearer", "invalid");

    var response = await _fixture.ApiClient.SendAsync(request);

    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }
}
