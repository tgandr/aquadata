using System.Security.Cryptography;
using System.Text;
using Aquadata.Core.Entities.Financial;
using Aquadata.Core.Interfaces;
using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.Entities.User;

public class UserEntity :Entity, IAggregateRoot
{
  public string Name {get; private set;}
  public string Email {get; private set;}
  public string Profile {get; private set;}
  public byte[] PasswordHash {get; private set;}
  public byte[] PasswordSalt {get; private set;}
  public string FarmName {get; private set;}
  public string FarmAddress {get; private set;}
  public string Phone {get; private set;}

  private UserEntity() {}
  private UserEntity(string name, string email, string password, string profile, 
  string farmName, string farmAddress, string phone)
  {
    using var hmac = new HMACSHA256();

    Name = name;
    Email = email;
    FarmName = farmName;
    FarmAddress = farmAddress;
    Phone = phone;
    Profile = profile;

    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
    PasswordSalt = hmac.Key;
  }

  public static Result<UserEntity> Of(
    string name, string email, string  password, string profile,
    string farmName, string farmAddress, string phone) 
  => Create (new UserEntity(name, email, password, profile, 
    farmName, farmAddress, phone));
  

  public Result<UserEntity> Update(string name, string profile,
    string farmName, string farmAddress, string phone)
  {
    Name = name;
    FarmName = farmName;
    FarmAddress = farmAddress;
    Phone = phone;
    Profile = profile;
    
    var validateResult = Validate();
    if (validateResult.IsFail)
      return Result<UserEntity>.Fail(validateResult.Error!); 
      
    return Result<UserEntity>.Ok(this);
  }

  protected override Result<Entity> Validate()
  {
    if (string.IsNullOrWhiteSpace(Name))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.User",
          "Name cannot be null or Empty"
        )
      );
    if (string.IsNullOrWhiteSpace(Email))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.User",
          "Email cannot be null or Empty"
        )
      );
    if (string.IsNullOrWhiteSpace(FarmName))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.User",
          "FarmName cannot be null or Empty"
        )
      );
    if (string.IsNullOrWhiteSpace(FarmAddress))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.User",
          "FarmAddress cannot be null or Empty"
        )
      );
    if (string.IsNullOrWhiteSpace(Phone))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.User",
          "Phone cannot be null or Empty"
        )
      );
    if (string.IsNullOrWhiteSpace(Profile))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.User",
          "Profile cannot be null or Empty"
        )
      );
    return Result<Entity>.Ok(this); 
  }
}
