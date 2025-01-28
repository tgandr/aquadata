using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.User.Common;
using Aquadata.Core.Entities.User;

namespace Application.UseCases.User.CreateUser;

public class CreateUserInput: IUseCaseRequest<UserOutput>
{
  public string Name {get;}
  public string Email {get;}
  public string Password {get;}
  public string FarmName {get;}
  public string FarmAddress {get;}
  public string Profile {get;}
  public string Phone {get;}

  public CreateUserInput(string name, string email, string password, 
  string farmName, string farmAddress, string profile, string phone)
  {
    Name = name;
    Email = email;
    Password = password;
    FarmName = farmName;
    FarmAddress = farmAddress;
    Profile = profile;
    Phone = phone;
  }
}
