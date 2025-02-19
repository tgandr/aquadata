using Aquadata.Infra.EF.Context;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace Aquadata.EndToEndTests.Api.Base;

public class WebAppFactory<TStartup>
  :WebApplicationFactory<TStartup> 
  where TStartup:class
{
  protected override void ConfigureWebHost(IWebHostBuilder builder)
  {
    builder.ConfigureServices(services =>
    {
      var environment = "Development";
      Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", environment);
      builder.UseEnvironment(environment);
      builder.ConfigureServices(services => {
        var serviceProvider = services.BuildServiceProvider();
        using var scope = serviceProvider.CreateScope();

        var context = scope.ServiceProvider
          .GetService<ApplicationDbContext>();

        if (context == null)
        {
          throw new NullReferenceException(
            "ApplicationDbContext is null");
        }
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();
      });
      base.ConfigureWebHost(builder);
    });
  }

  public override ValueTask DisposeAsync()
  {
    return base.DisposeAsync();
  }
}
