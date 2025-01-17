using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.CreatePond;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Infra.EF;
using Aquadata.Infra.EF.Repositories;

namespace Aquadata.Api.Configs;

public static class UseCasesConfig
{
  public static IServiceCollection AddUseCases(
    this IServiceCollection services)
  {
    services.AddMediatR(cfg =>
      cfg.RegisterServicesFromAssembly(typeof(CreatePond).Assembly)
    ); 

    services.AddRepositories();

    return services;
  }

  public static IServiceCollection AddRepositories(
    this IServiceCollection services)
  {
    services.AddTransient<IPondRepository, PondRepository>();
    services.AddTransient<IUserRepository, UserRepository>();
    services.AddTransient<IUnitOfWork, UnitOfWork>();

    return services;
  }
}
