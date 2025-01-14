using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.Application.UseCases.User.UpdateUser;
public class UpdateUserInput : IApplicationRequest<UserOutput>
{
  public Guid Id {get;}
  public string Name { get; }
  public string FarmName { get; }
  public string FarmAddress { get; }
  public string Profile { get; }
  public string Phone { get; }

  public UpdateUserInput(Guid id, string name,
  string farmName, string farmAddress, string profile, string phone)
  {
    Id = id;
    Name = name;
    FarmName = farmName;
    FarmAddress = farmAddress;
    Profile = profile;
    Phone = phone;
  }
}
