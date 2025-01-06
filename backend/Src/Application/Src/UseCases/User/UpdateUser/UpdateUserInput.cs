using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.Application.UseCases.User.UpdateUser;
public class UpdateUserInput : IApplicationRequest<UserOutput>
{
  public Guid Id {get;}
  public string Name { get; }
  public string Email { get; }
  public string Password { get; }
  public string FarmName { get; }
  public string FarmAddress { get; }
  public string Profile { get; }
  public string Phone { get; }

  public UpdateUserInput(Guid id, string name, string email, string password,
  string farmName, string farmAddress, string profile, string phone)
  {
    Id = id;
    Name = name;
    Email = email;
    Password = password;
    FarmName = farmName;
    FarmAddress = farmAddress;
    Profile = profile;
    Phone = phone;
  }
}
