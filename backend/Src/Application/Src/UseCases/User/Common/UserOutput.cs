using Aquadata.Application.Dtos;
using Aquadata.Core.Entities.User;

namespace Aquadata.Application.UseCases.User.Common;

public class UserOutput
{
  public Guid Id {get;}
  public string Name { get; }
  public string Email {get; }
  public string FarmName { get; }
  public string FarmAddress { get; }
  public string Profile { get; }
  public string Phone { get; }


  public UserOutput(Guid id, string name, string email, string farmName, 
    string farmAddress, string profile, string phone)
  {
    Id = id;
    Name = name;
    Email = email;
    FarmName = farmName;
    FarmAddress = farmAddress;
    Profile = profile;
    Phone = phone;
  }

  public static UserOutput FromEntity(UserEntity user)
    => new (
      user.Id,
      user.Name,
      user.Email,
      user.FarmName,
      user.FarmAddress,
      user.Profile,
      user.Phone
    );
  
}
