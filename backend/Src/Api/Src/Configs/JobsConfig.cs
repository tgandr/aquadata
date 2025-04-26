using System.Transactions;
using Aquadata.Infra.Payments.MercadoPago.Jobs;
using Hangfire;
using Hangfire.MySql;

namespace Aquadata.Api.Configs;

public static class JobsConfig
{
  public static void AddJobs(this IServiceCollection services, IConfiguration configuration)
  {
    services.AddHangfire(config => 
      config.UseStorage(new MySqlStorage(configuration.GetConnectionString("DefaultConnection"), new MySqlStorageOptions
      {
        TransactionIsolationLevel = IsolationLevel.ReadCommitted,
        QueuePollInterval = TimeSpan.FromSeconds(15),
        JobExpirationCheckInterval = TimeSpan.FromMinutes(1),
        CountersAggregateInterval = TimeSpan.FromMinutes(5),
        PrepareSchemaIfNecessary = true,
        DashboardJobListLimit = 50000,
        TransactionTimeout = TimeSpan.FromMinutes(1),
        TablesPrefix = "Hangfire"
      })));

    services.AddHangfireServer(options => {
      options.WorkerCount = 1;
    });
  }
}
