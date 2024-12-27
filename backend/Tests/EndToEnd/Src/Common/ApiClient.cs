using System.Text;
using System.Text.Json;

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

  public async Task<T> GetOutput<T>(HttpResponseMessage res)
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
    return output!;
  }

  public async Task<(HttpResponseMessage, T)> Post<T>(string route, 
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
}
