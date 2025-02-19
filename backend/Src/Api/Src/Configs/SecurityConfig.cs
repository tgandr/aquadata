using Aquadata.Application.Interfaces;
using Aquadata.Core.Security;
using Aquadata.Infra.Security.Services;
using Aquadata.Infra.Security.Validation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;

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
    AddSwaggerSecurity(services);
    
    services.AddHttpContextAccessor();
    services.AddTransient<IAuthenticatedUserService, AuthenticatedUserService>();
    services.AddTransient<IAuthenticateService, AuthenticateService>();
    return services;
  }


  private static IServiceCollection AddSwaggerSecurity(IServiceCollection services)
  {
    services.AddSwaggerGen(c =>
    {
      c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
      {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
      });

      c.AddSecurityRequirement(new OpenApiSecurityRequirement
      {
        {
          new OpenApiSecurityScheme
          {
            Reference = new OpenApiReference
            {
              Type = ReferenceType.SecurityScheme,
              Id = "Bearer"
            }
          },
          new string[] { }
        }
      });
    });

    return services;
  }
}
