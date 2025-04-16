using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.CreatePond;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Infra.CouchDb;
using Aquadata.Infra.EF;
using Aquadata.Infra.EF.Repositories;
using Aquadata.Infra.Payments.MercadoPago;
using Aquadata.Infra.Payments.MercadoPago.Models;
using Aquadata.Infra.Security.BasicAuth.Services;
using Aquadata.Infra.Security.JWT.Services;
using MercadoPago.Client.Payment;
using MercadoPago.Resource.Payment;
using Microsoft.OpenApi.Models;

namespace Aquadata.Api.Configs;

public static class DependencyInjection
{
  public static IServiceCollection InjectDependencies(
    this IServiceCollection services)
  {
    services.AddMediatR(cfg =>
      cfg.RegisterServicesFromAssembly(typeof(CreatePond).Assembly)
    ); 

    services.AddScoped<IAuthenticatedUserService, AuthenticatedUserService>();
    // services.AddTransient<IJwtAuthService, JwtAuthService>();
    services.AddScoped<IAuthService, BasicAuthService>();
    services.AddScoped<IPondRepository, PondRepository>();
    services.AddScoped<IUserRepository, UserRepository>();
    services.AddScoped<IFinancialRepository, FinancialRepository>();
    services.AddScoped<IPaymentRepository, PaymentRepository>();
    services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
    services.AddScoped<ICultivationRepository, CultivationRepository>();
    services.AddScoped<IUnitOfWork, UnitOfWork>();
    services.AddSingleton<ICouchdbService, AquadataCouchDb>();
    services.AddSingleton<IPaymentGateway,MercadoPagoService>();

    return services;
  }

}
