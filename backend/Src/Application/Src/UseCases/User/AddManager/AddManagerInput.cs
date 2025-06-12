using Aquadata.Application.Interfaces;

namespace Aquadata.Application.UseCases.User.AddManager;

public class AddManagerInput : IUseCaseRequest<object>
{
  public string Name { get; }
  public string Phone { get; }
  public string Password { get; }

  public AddManagerInput(string name, string phone, string password)
  {
    Name = name;
    Phone = phone;
    Password = password;
  }

}
