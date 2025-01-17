using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Aquadata.Infra.Security.Validation;

public static class TokenValidation
{
  public static TokenValidationParameters GetParameters(IConfiguration config)
  {
    var privateKey = new SymmetricSecurityKey(
      Encoding.UTF8.GetBytes(config["jwt:secretKey"]!)
    );

    return new TokenValidationParameters
    {
      ValidateIssuer = true,
      ValidateAudience = true,
      ValidateLifetime = true,
      ValidateIssuerSigningKey = true,
      ValidIssuer = config["jwt:issuer"],
      ValidAudience = config["jwt:audience"],
      IssuerSigningKey = privateKey,
      ClockSkew = TimeSpan.Zero
    };
  } 
}
