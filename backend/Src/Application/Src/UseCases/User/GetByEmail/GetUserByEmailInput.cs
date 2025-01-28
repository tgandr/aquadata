using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.Application.UseCases.User.GetByEmail;

public class GetUserByEmailInput: IUseCaseRequest<UserOutput>
{
  public string Email {get;}

  public GetUserByEmailInput(string email)
    => Email = email;
}
