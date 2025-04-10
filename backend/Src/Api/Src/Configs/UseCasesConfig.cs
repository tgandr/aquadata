using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.CreatePond;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Infra.EF;
using Aquadata.Infra.EF.Repositories;
using Aquadata.Infra.Payments.MercadoPago;
using MercadoPago.Client.Payment;
using MercadoPago.Resource.Payment;
using Microsoft.OpenApi.Models;

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
    services.AddTransient<IFinancialRepository, FinancialRepository>();
    services.AddTransient<ICultivationRepository, CultivationRepository>();
    services.AddTransient<IUnitOfWork, UnitOfWork>();
    services.AddTransient<
      IPaymentService<PaymentCreateRequest, Payment>, 
      MercadoPagoService
    >();

    return services;
  }
}
