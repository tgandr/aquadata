using System.Security.Cryptography;
using System.Text;
using Aquadata.Core.Entities.User;
using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Manager;

public class ManagerEntity : Entity
{
  public string Name { get; private set; }
  public string Phone { get; private set; }
  public byte[] PasswordHash { get; private set; }
  public byte[] PasswordSalt { get; private set; }

  public virtual UserEntity Producer { get; set; }
  public virtual Guid? ProducerId { get; set; }

  private ManagerEntity(){}

  private ManagerEntity(string name, string phone, string password)
  {
    using var hmac = new HMACSHA256();
    Name = name;
    Phone = phone;
    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
    PasswordSalt = hmac.Key;
  }

  public static Result<ManagerEntity> Of(string name, string phone, string password)
    => Create(new ManagerEntity(name, phone, password));

  protected override Result<Entity> Validate()
  {
    return Result<Entity>.Ok(this);
  }
}
