using Aquadata.Core.Entity.Pond;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entity.User;

public class UserEntity : SeedWork.Entity
{
  public string Name {get;}
  public string Email {get;}
  public string Profile {get;}
  public string Password {get;}
  public string FarmName {get;}
  public string FarmAddress {get;}
  public string Phone {get;}
  public virtual ICollection<PondEntity>? Ponds {get;} 

  private UserEntity(string name, string email, string profile, string password, 
  string farmName, string farmAddress, string phone)
  {
    Name = name;
    Email = email;
    Password = password;
    FarmName = farmName;
    FarmAddress = farmAddress;
    Phone = phone;
    Profile = profile;
  }

  public static Result<UserEntity, EntityValidationException> Of(
    string name, string email, string  profile, string password,
    string farmName, string farmAddress, string phone) 
  => Create (new UserEntity(name, email, profile, password, 
    farmName, farmAddress, phone));
  

  protected override Result<EntityValidationException> Validate()
  {
    if (string.IsNullOrWhiteSpace(Name))
      return Result<EntityValidationException>.Fail(
        new EntityValidationException("User name cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(Email))
      return Result<EntityValidationException>.Fail(
        new EntityValidationException("User email cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(Password))
      return Result<EntityValidationException>.Fail(
        new EntityValidationException("User password cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(FarmName))
      return Result<EntityValidationException>.Fail(
        new EntityValidationException("User farmName cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(FarmAddress))
      return Result<EntityValidationException>.Fail(
        new EntityValidationException("User farmAddress cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(Phone))
      return Result<EntityValidationException>.Fail(
        new EntityValidationException("User phone cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(Profile))
      return Result<EntityValidationException>.Fail(
        new EntityValidationException("User profile cannot be null or Empty")
      );
    return Result<EntityValidationException>.Ok(); 
  }
}
