using Aquadata.Core.Security;
using Aquadata.Infra.Security.Services;
using Aquadata.Infra.Security.Validation;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Aquadata.Api.Configs;

public static class SecurityConfig
{
  public static IServiceCollection AddSecurity(this IServiceCollection services,
  IConfiguration config)
  {
    services.AddAuthentication(x => 
    {
      x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
      x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(x => {
      x.RequireHttpsMetadata = true;
      x.SaveToken = true;
      x.TokenValidationParameters = TokenValidation.GetParameters(config);
    });

    services.AddTransient<IAuthenticateService, AuthenticateService>();
    return services;
  }
}
