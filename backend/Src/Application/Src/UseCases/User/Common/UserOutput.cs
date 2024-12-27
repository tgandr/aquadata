using Aquadata.Core.Entities.User;

namespace Aquadata.Application.UseCases.User.Common;

public class UserOutput
{
  public Guid Id {get;}
  public string Name { get; }
  public string Email { get; }
  public string Password { get; }
  public string FarmName { get; }
  public string FarmAddress { get; }
  public string Profile { get; }
  public string Phone { get; }
  public DateTime CreatedAt {get;}
  public DateTime UpdatedAt {get;}

  public UserOutput(Guid id, string name, string email, string password, string farmName, 
    string farmAddress, string profile, string phone, DateTime createdAt, DateTime updatedAt)
  {
    Id = id;
    Name = name;
    Email = email;
    Password = password;
    FarmName = farmName;
    FarmAddress = farmAddress;
    Profile = profile;
    Phone = phone;
    CreatedAt = createdAt;
    UpdatedAt = updatedAt;
  }

  public static UserOutput FromEntity(UserEntity user)
    => new UserOutput(
      user.Id,
      user.Name,
      user.Email,
      user.Password,
      user.FarmName,
      user.FarmAddress,
      user.Profile,
      user.Phone,
      user.CreatedAt,
      user.UpdatedAt
    );
  
}
