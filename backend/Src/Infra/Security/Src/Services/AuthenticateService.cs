using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Aquadata.Core.Security;
using Aquadata.Infra.EF.Context;
using Aquadata.Infra.Security.Validation;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Aquadata.Infra.Security.Services;

public class AuthenticateService: IAuthenticateService
{
  private readonly ApplicationDbContext _context;
  private readonly IHttpContextAccessor _httpAcessor;
  private readonly IConfiguration _config;

  public AuthenticateService(ApplicationDbContext context, IConfiguration config,
  IHttpContextAccessor httpAcessor)
  {
    _httpAcessor = httpAcessor;
    _context = context;
    _config = config;
  }

  public async Task<bool> Authenticate(string email, string password)
  {
    var user = await _context.Users
      .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

    if (user == null)
      return false;
    
    using var hmac = new HMACSHA256(user.PasswordSalt);
    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

    for (int i = 0; i < computedHash.Length; i++)
    {
      if (computedHash[i] != user.PasswordHash![i])
        return false;
    }

    return true;
  }

  public string GenerateToken(string id, string email)
  {
    var claims = new[]
    {
      new Claim(ClaimTypes.NameIdentifier, id),
      new Claim(ClaimTypes.Email, email),
      new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    var privateKey = new SymmetricSecurityKey(
      Encoding.UTF8.GetBytes(_config["jwt:secretKey"]!)
    );

    var credentials = new SigningCredentials(privateKey, SecurityAlgorithms.HmacSha256);
    var expiration = DateTime.UtcNow.AddHours(1);

    var token = new JwtSecurityToken(
      issuer: _config["jwt:issuer"],
      audience: _config["jwt:audience"],
      claims: claims,
      expires: expiration,
      signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
  }

  public string? GetAuThenticatedUserId()
    => _httpAcessor.HttpContext?.User?
    .FindFirst(ClaimTypes.NameIdentifier)?.Value;

  public bool ValidateToken(string jwt)
  {
    var handler = new JwtSecurityTokenHandler();
    var parameters = TokenValidation.GetParameters(_config);

    try 
    {
      handler.ValidateToken(jwt, parameters, out _);
      return true;
    }
    catch
    {
      return false;
    }
  }
}
