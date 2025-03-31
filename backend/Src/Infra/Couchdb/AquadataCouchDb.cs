using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Aquadata.Application.Interfaces;
namespace Aquadata.Infra.CouchDb;

public class AquadataCouchDb: ICouchdbService
{
  private readonly HttpClient _client  = new HttpClient();
  private readonly string _couchDbUrl = "http://localhost:5984";
  private readonly string _adminUser = "admin";
  private readonly string _adminPassword = "aquadata";

  public async Task AddUser(string email, string password)
  {
    string[] roles = ["user"];
    string userDbUrl = $"userdb-{Convert.ToHexString(Encoding.UTF8.GetBytes(email))}".ToLower();
    string securityUrl = $"{_couchDbUrl}/{userDbUrl}/_security";
    string url = $"{_couchDbUrl}/_users/org.couchdb.user:{email}";
    var userStock = new 
    {
      _id = Guid.NewGuid().ToString(),
      dataType =  "stockData",
      feedPurchase = new List<object>(),
      probioticsPurchase =  new List<object>(),
      fertilizersPurchase =  new List<object>(),
      othersPurchase =  new List<object>()
    };
    var user = new {
      _id = $"org.couchdb.user:{email}",
      stockId = userStock._id,
      name = email,
      password = password,
      roles = roles,
      type = "user"
    };

    string authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_adminUser}:{_adminPassword}"));
    string jsonData = JsonSerializer.Serialize(user);
    string stockData = JsonSerializer.Serialize(userStock);
    var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
    var stockContent = new StringContent(stockData, Encoding.UTF8, "application/json");
    _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authHeader);

    // Cria novo usuário na tabela _users
    HttpResponseMessage createUserResponse = await _client.PutAsync(url, content);

    // Cria novo banco para o usuário cadastrado
    HttpResponseMessage createDbResponse = await _client.PutAsync($"{_couchDbUrl}/{userDbUrl}", null);
    HttpResponseMessage createStockResponse = await _client.PostAsync($"{_couchDbUrl}/{userDbUrl}", stockContent);
    
    var securityConfig = new 
    {
      admins = new { names = new string[] { }, roles = new string[] { "admin" } },
      members = new { names = new string[] { email }, roles = new string[] { "admin" } }
    };

    // Adiciona o novo usuário como membro do banco
    var securityContent = new StringContent(JsonSerializer.Serialize(securityConfig), Encoding.UTF8, "application/json");
    HttpResponseMessage addSecurityResponse = await _client.PutAsync(securityUrl, securityContent);

    var index = new
    {
      index = new
      {
          fields = new[] { "dataType" }
      },
      name = "index_data_type", // Nome do índice
      type = "json" // Tipo do índice
    };

    // Adiciona o campo dataType como índice
    var indexContent = new StringContent(JsonSerializer.Serialize(index), Encoding.UTF8, "application/json");
    HttpResponseMessage createIndexResponse = await _client.PostAsync(
      $"{_couchDbUrl}/{userDbUrl}/_index", 
      indexContent
    );
    if (!createUserResponse.IsSuccessStatusCode)
    {
      string errorMessage = await createUserResponse.Content.ReadAsStringAsync();
      Console.WriteLine("createUser:"+errorMessage);
    }
    if (!createDbResponse.IsSuccessStatusCode)
    {
      string errorMessage = await createDbResponse.Content.ReadAsStringAsync();
      Console.WriteLine("createDb:"+errorMessage);
    }
    if (!addSecurityResponse.IsSuccessStatusCode)
    {
      string errorMessage = await addSecurityResponse.Content.ReadAsStringAsync();
      Console.WriteLine("AddSecurity:"+errorMessage);
    }
    if (!createIndexResponse.IsSuccessStatusCode)
    {
      string errorMessage = await createIndexResponse.Content.ReadAsStringAsync();
      Console.WriteLine("createIndex:"+errorMessage);
    }
    if (!createStockResponse.IsSuccessStatusCode)
    {
      string errorMessage = await createStockResponse.Content.ReadAsStringAsync();
      Console.WriteLine("createStock:"+errorMessage);
    }
  }

}
