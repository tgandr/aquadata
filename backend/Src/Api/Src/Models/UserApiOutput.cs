using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.Api.Models;

public class UserApiOutput
{
  public UserOutput User {get;}
  public string Token {get;}

  public UserApiOutput(UserOutput user, string token)
  {
    User = user;
    Token = token;
  }
}
