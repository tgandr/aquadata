using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Application.UseCases.User.CreateUser;
using Aquadata.Api.Models;
using Aquadata.Api.Response;
using Aquadata.Core.Entities.User;

namespace Aquadata.EndToEndTests.Common;

public class ApiClient
{
  private readonly HttpClient _httpClient;
  private readonly JsonSerializerOptions _jsonSerializerOptions;
  public ApiClient(HttpClient httpClient)
  {
    _httpClient = httpClient;
    _jsonSerializerOptions = new JsonSerializerOptions
    {
      PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
      PropertyNameCaseInsensitive = true
    };
  }

  private void AddAuthorizationHeader(string token)
  {
    _httpClient.DefaultRequestHeaders
      .Authorization = new AuthenticationHeaderValue(
        "Bearer", token);
  }

  public async Task<UserApiOutput> SignUp(CreateUserInput? user = null)
  {
    string payload;

    if (user != null)
      payload = JsonSerializer.Serialize(user);
    else payload = JsonSerializer.Serialize(
      new CreateUserInput("name",
      "email"+Guid.NewGuid(),
      "123456",
      "profile",
      "farmName",
      "farmAddress", 
      "phone")
    );

    var response = await _httpClient.PostAsync(
      "/users/signup",
      new StringContent(
        payload,
        Encoding.UTF8,
        "application/json"
      )
    );

    var output = await GetOutput<ApiResponse<UserApiOutput>>(response);
    AddAuthorizationHeader(output!.Data.Token);
    return output!.Data;
  }
  public async Task<T?> GetOutput<T>(HttpResponseMessage res)
    where T : class
  {
    var outputString = await res.Content.ReadAsStringAsync();
    T? output = null;

    if (!string.IsNullOrEmpty(outputString))
    {
      output = JsonSerializer.Deserialize<T>(
        outputString,
        _jsonSerializerOptions
      );
    }
    return output;
  }

  public async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request)
    => await _httpClient.SendAsync(request);

  public async Task<(HttpResponseMessage?, T?)> Put<T>(string route, 
    object payload) where T : class
  {
    var payloadJson = JsonSerializer.Serialize(payload,
    _jsonSerializerOptions);
    var response = await _httpClient.PutAsync(
      route,
      new StringContent(
        payloadJson,
        Encoding.UTF8,
        "application/json"
      )
    );
    var output = await GetOutput<T>(response);
    
    return (response, output);
  }

  public async Task<(HttpResponseMessage?, T?)> Post<T>(string route, 
    object payload) where T : class
  {
    var payloadJson = JsonSerializer.Serialize(payload, _jsonSerializerOptions);
    var response = await _httpClient.PostAsync(
      route,
      new StringContent(
        payloadJson,
        Encoding.UTF8,
        "application/json"
      )
    );

    var output = await GetOutput<T>(response);
    return (response, output);
  }

  public async Task<(HttpResponseMessage?, T?)> Get<T>(string route) 
    where T : class
  {
    var response = await _httpClient.GetAsync(route);
    var output = await GetOutput<T>(response);
    return (response, output);
  }

  public async Task<(HttpResponseMessage?, T?)> Delete<T>(string route) 
    where T : class
  {
    var response = await _httpClient.DeleteAsync(route);
    var output = await GetOutput<T>(response);
    return (response, output);
  }
}
