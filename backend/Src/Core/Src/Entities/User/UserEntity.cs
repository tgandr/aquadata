using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.User;

public class UserEntity : SeedWork.Entity
{
  public string Name {get;}
  public string Email {get;}
  public string Profile {get;}
  public string Password {get;}
  public string FarmName {get;}
  public string FarmAddress {get;}
  public string Phone {get;}
  public virtual ICollection<PondEntity>? Ponds {get;set;} 

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

  public static Result<UserEntity, ModelValidationException> Of(
    string name, string email, string  profile, string password,
    string farmName, string farmAddress, string phone) 
  => Create (new UserEntity(name, email, profile, password, 
    farmName, farmAddress, phone));
  

  protected override Result<ModelValidationException> Validate()
  {
    if (string.IsNullOrWhiteSpace(Name))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("User name cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(Email))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("User email cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(Password))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("User password cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(FarmName))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("User farmName cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(FarmAddress))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("User farmAddress cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(Phone))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("User phone cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(Profile))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("User profile cannot be null or Empty")
      );
    return Result<ModelValidationException>.Ok(); 
  }
}
