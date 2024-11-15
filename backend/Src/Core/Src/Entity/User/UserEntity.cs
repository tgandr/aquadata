using Aquadata.Core.Util;

namespace Aquadata.Core.Entity.User;

public class UserEntity : SeedWork.Entity
{
  public string Name {get;}
  public string Email {get;}
  public string Password {get;}
  public string FarmName {get;}
  public string FarmAddress {get;}
  public string Phone {get;}

  private UserEntity(string name, string email, string password, string farmName, string farmAddress, string phone)
  {
    Name = name;
    Email = email;
    Password = password;
    FarmName = farmName;
    FarmAddress = farmAddress;
    Phone = phone;
  }

  public static Result<UserEntity, Exception> Of(
    string name, string email, string password, 
    string farmName, string farmAddress, string phone)
  {
    return Result<UserEntity,Exception>.Ok(new UserEntity(
      name, email, password, farmName, farmAddress, phone
    ));
  }

  protected override Result<Exception> Validate()
  {
    return Result<Exception>.Ok(); 
  }
}
