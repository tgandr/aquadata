using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Aquadata.Application.Interfaces;
using Microsoft.Extensions.Configuration;
namespace Aquadata.Infra.CouchDb;

public class AquadataCouchDb : ICouchdbService
{
  private readonly HttpClient _client = new HttpClient();
  private readonly string _couchDbUrl;
  private readonly string _adminUser;
  private readonly string _adminPassword;

  public AquadataCouchDb(IConfiguration configuration)
  {
    _couchDbUrl = configuration["CouchDb:Url"]!;
    _adminUser = configuration["CouchDb:Username"]!;
    _adminPassword = configuration["CouchDb:Password"]!;
    AddHeaders();
  }
  private string GetUserDbUrl(string email)
  {
    return $"userdb-{Convert.ToHexString(Encoding.UTF8.GetBytes(email))}".ToLower();
  }

  private void AddHeaders()
  {
    string authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_adminUser}:{_adminPassword}"));
    _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authHeader);
  }

  public async Task AddUser(string user, string password)
  {
    string[] roles = ["user"];
    string usersUrl = $"{_couchDbUrl}/_users/org.couchdb.user:{user}";

    var newUser = new
    {
      _id = $"org.couchdb.user:{user}",
      name = user,
      password,
      roles,
      type = "user"
    };

    string jsonData = JsonSerializer.Serialize(newUser);
    var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
    string authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_adminUser}:{_adminPassword}"));
    _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authHeader);

    await _client.PutAsync(usersUrl, content);
  }

  public async Task AddUserAndCreateDb(string login, string password)
  {
    string[] roles = ["user"];
    string userDbUrl = GetUserDbUrl(login);
    string usersUrl = $"{_couchDbUrl}/_users/org.couchdb.user:{login}";

    var userStock = new
    {
      _id = Guid.NewGuid().ToString(),
      dataType = "stockData",
      feedPurchase = new List<object>(),
      probioticsPurchase = new List<object>(),
      fertilizersPurchase = new List<object>(),
      othersPurchase = new List<object>()
    };

    var user = new
    {
      _id = $"org.couchdb.user:{login}",
      stockId = userStock._id,
      name = login,
      password,
      roles,
      type = "user"
    };

    string authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_adminUser}:{_adminPassword}"));
    string jsonData = JsonSerializer.Serialize(user);
    string stockData = JsonSerializer.Serialize(userStock);
    var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
    var stockContent = new StringContent(stockData, Encoding.UTF8, "application/json");
    _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authHeader);

    // Cria novo usuário na tabela _users
    HttpResponseMessage createUserResponse = await _client.PutAsync(usersUrl, content);

    // Cria novo banco para o usuário cadastrado
    HttpResponseMessage createDbResponse = await _client.PutAsync($"{_couchDbUrl}/{userDbUrl}", null);
    HttpResponseMessage createStockResponse = await _client.PostAsync($"{_couchDbUrl}/{userDbUrl}", stockContent);

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
      Console.WriteLine("createUser:" + errorMessage);
    }
    if (!createDbResponse.IsSuccessStatusCode)
    {
      string errorMessage = await createDbResponse.Content.ReadAsStringAsync();
      Console.WriteLine("createDb:" + errorMessage);
    }
    if (!createIndexResponse.IsSuccessStatusCode)
    {
      string errorMessage = await createIndexResponse.Content.ReadAsStringAsync();
      Console.WriteLine("createIndex:" + errorMessage);
    }
    if (!createStockResponse.IsSuccessStatusCode)
    {
      string errorMessage = await createStockResponse.Content.ReadAsStringAsync();
      Console.WriteLine("createStock:" + errorMessage);
    }
  }

  public async Task SetUserAsMember(string email)
  {
    var securityUrl = $"{_couchDbUrl}/{GetUserDbUrl(email)}/_security";
    var securityConfig = new
    {
      admins = new { names = new string[] { }, roles = new string[] { "admin" } },
      members = new { names = new string[] { email }, roles = new string[] { "admin" } }
    };

    var securityContent = new StringContent(JsonSerializer.Serialize(securityConfig), Encoding.UTF8, "application/json");
    HttpResponseMessage addSecurityResponse = await _client.PutAsync(securityUrl, securityContent);

    if (!addSecurityResponse.IsSuccessStatusCode)
    {
      string errorMessage = await addSecurityResponse.Content.ReadAsStringAsync();
      Console.WriteLine("AddSecurity:" + errorMessage);
    }
  }

  public async Task RemoveUserFromMembers(string email)
  {
    var securityUrl = $"{_couchDbUrl}/{GetUserDbUrl(email)}/_security";
    var securityConfig = new
    {
      admins = new { names = new string[] { }, roles = new string[] { "admin" } },
      members = new { names = new string[] { email }, roles = new string[] { "admin" } }
    };

    var securityContent = new StringContent(JsonSerializer.Serialize(securityConfig), Encoding.UTF8, "application/json");
    HttpResponseMessage addSecurityResponse = await _client.PutAsync(securityUrl, securityContent);

    if (!addSecurityResponse.IsSuccessStatusCode)
    {
      string errorMessage = await addSecurityResponse.Content.ReadAsStringAsync();
      Console.WriteLine("AddSecurity:" + errorMessage);
    }
  }

  public async Task AddDataToDb(string user, object data)
  {
    string userDbUrl = GetUserDbUrl(user);

    string jsonData = JsonSerializer.Serialize(data);
    var content = new StringContent(jsonData, Encoding.UTF8, "application/json");

    await _client.PostAsync(
      $"{_couchDbUrl}/{userDbUrl}",
      content
    );
  }

  public async Task AddMemberToDb(string member, string db)
  {
    var securityUrl = $"{_couchDbUrl}/{GetUserDbUrl(db)}/_security";
    var securityConfig = new
    {
      admins = new { names = new string[] { }, roles = new string[] { "admin" } },
      members = new { names = new string[] { db, member }, roles = new string[] { "admin" } }
    };

    var securityContent = new StringContent(JsonSerializer.Serialize(securityConfig), Encoding.UTF8, "application/json");
    HttpResponseMessage addSecurityResponse = await _client.PutAsync(securityUrl, securityContent);

    if (!addSecurityResponse.IsSuccessStatusCode)
    {
      string errorMessage = await addSecurityResponse.Content.ReadAsStringAsync();
      Console.WriteLine("AddSecurity:" + errorMessage);
    }
  }
}
