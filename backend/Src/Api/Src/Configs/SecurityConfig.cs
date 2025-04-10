using Aquadata.Application.Interfaces;
using Aquadata.Infra.Security.BasicAuth;
using Aquadata.Infra.Security.JWT.Services;
using Aquadata.Infra.Security.JWT.Validation;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;

namespace Aquadata.Api.Configs;

public static class SecurityConfig
{
  public static IServiceCollection AddJWT(this IServiceCollection services,
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
    AddSwaggerJWT(services);
    
    services.AddHttpContextAccessor();
    services.AddTransient<IAuthenticatedUserService, AuthenticatedUserService>();
    services.AddTransient<IAuthenticateService, AuthenticateService>();
    return services;
  }

  public static IServiceCollection AddBasicAuth(this IServiceCollection services)
  {
    services.AddAuthentication("Basic")
      .AddScheme<AuthenticationSchemeOptions, BasicAuthHandler>("Basic", null);

    AddSwaggerBasicAuth(services);
    return services;
  }
  
  private static IServiceCollection AddSwaggerBasicAuth(IServiceCollection services)
  {
    services.AddSwaggerGen(c =>
    {
      c.AddSecurityDefinition("Basic", new OpenApiSecurityScheme
      {
        Description = "Basic Authentication header using the Basic scheme. Example: \"Authorization: Basic {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Basic"
      });

      c.AddSecurityRequirement(new OpenApiSecurityRequirement
      {
        {
          new OpenApiSecurityScheme
          {
            Reference = new OpenApiReference
            {
              Type = ReferenceType.SecurityScheme,
              Id = "Basic"
            }
          },
          new string[] { }
        }
      });
    });

    return services;
  }

  private static IServiceCollection AddSwaggerJWT(IServiceCollection services)
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
