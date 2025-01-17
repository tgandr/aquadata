using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.Api.Configs;

public static class ConnectionsConfig
{
  public static IServiceCollection AddAppConnection(
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
    return services;
  }
}
