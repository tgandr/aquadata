using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.Api.Models;

public class ApiCredentials
{
  public UserOutput User {get;}
  public string Token {get;}

  public ApiCredentials(UserOutput user, string token)
  {
    User = user;
    Token = token;
  }
}
