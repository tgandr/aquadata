using Aquadata.Application.Interfaces;
using Aquadata.Infra.CouchDb;
using Aquadata.Infra.EF.Context;
using CouchDB.Driver.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.Api.Configs;

public static class ConnectionsConfig
{
  public static IServiceCollection AddAppConnections(
    this IServiceCollection services,
    IConfiguration configuration)
  {
    services.AddDbConnection(configuration);
    return services;
  }

  public static IServiceCollection AddDbConnection(
    this IServiceCollection services,
    IConfiguration configuration)
  {
    var connectionString = configuration
      .GetConnectionString("DefaultConnection");

    services.AddDbContext<ApplicationDbContext>(
      options => options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
      )
    );

    services.AddCouchContext<AquadataCouchDb>(opts => {
      opts.UseEndpoint("http://localhost:5984")
        .EnsureDatabaseExists()
        .UseBasicAuthentication("admin", "aquadata");
    });

    services.AddTransient<ICouchdbService, AquadataCouchDb>();
    return services;
  }
}
