using Aquadata.EndToEndTests.Common;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Aquadata.EndToEndTests.Api.Base;

public class BaseFixture: IDisposable
{
  public WebAppFactory<Program> Factory {get;set;}
  public HttpClient HttpClient {get;set;}
  public ApiClient ApiClient {get;set;}
  private readonly string _dbConnectionString;

  public BaseFixture()
  {
    Factory = new WebAppFactory<Program>();
    HttpClient = Factory.CreateClient();
    ApiClient = new ApiClient(HttpClient);
    
    var configuration = Factory.Services
      .GetRequiredService<IConfiguration>();
    
    if (configuration == null)
    {
      throw new NullReferenceException(
        "Configuration is null");
    }

    _dbConnectionString = configuration.GetConnectionString("DefaultConnection")!;
  }

  public ApplicationDbContext CreateDbContext()
  {
    var context = new ApplicationDbContext(
        new DbContextOptionsBuilder<ApplicationDbContext>()
        .UseMySql(
            _dbConnectionString, 
            ServerVersion.AutoDetect(_dbConnectionString)
        )
        .Options
    );
    return context;
  }
  public void CleanPersistence()
  {
    var context = CreateDbContext();
    context.Database.EnsureDeleted();
    context.Database.EnsureCreated();
  }

  public void Dispose()
  {
    Factory.Dispose();
  }
}
