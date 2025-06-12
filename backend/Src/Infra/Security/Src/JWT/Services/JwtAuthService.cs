using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Aquadata.Core.Entities.User;
using Aquadata.Application.Interfaces;
using Aquadata.Infra.EF.Context;
using Aquadata.Infra.Security.JWT.Validation;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Aquadata.Core.Entities.Manager;

namespace Aquadata.Infra.Security.JWT.Services;

public class JwtAuthService: IJwtAuthService
{
  private readonly ApplicationDbContext _context;
  private readonly IHttpContextAccessor _httpAcessor;
  private readonly IConfiguration _config;

  public JwtAuthService(ApplicationDbContext context, IConfiguration config,
  IHttpContextAccessor httpAcessor)
  {
    _httpAcessor = httpAcessor;
    _context = context;
    _config = config;
  }

  public async Task<(bool, UserEntity?)> Authenticate(string email, string password)
  {
    var user = await _context.Users
      .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

    if (user == null)
      return (false, null);
    
    using var hmac = new HMACSHA256(user.PasswordSalt);
    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

    for (int i = 0; i < computedHash.Length; i++)
    {
      if (computedHash[i] != user.PasswordHash![i])
        return (false, null);
    }

    return (true, user);
  }

  public Task<(bool, ManagerEntity?)> AuthenticateManager(string phone, string password)
  {
    throw new NotImplementedException();
  }

  public string GenerateToken(string id, string email)
  {
    var claims = new[]
    {
      new Claim(ClaimTypes.NameIdentifier, id),
      new Claim(ClaimTypes.Email, email),
      new Claim(JwtRegisteredClaimNames.Sub, email),
      new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    var privateKey = new SymmetricSecurityKey(
      Encoding.UTF8.GetBytes(_config["jwt:secretKey"]!)
    );

    var credentials = new SigningCredentials(privateKey, SecurityAlgorithms.HmacSha256);
    var expiration = DateTime.UtcNow.AddDays(1);

    var token = new JwtSecurityToken(
      issuer: _config["jwt:issuer"],
      audience: _config["jwt:audience"],
      claims: claims,
      expires: expiration,
      signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
  }

  public string? GetAuthenticatedUserId()
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
