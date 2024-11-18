using Aquadata.Core.Entity.User;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;
using Unit.Src.Domain.Entity.User;
using CoreEntity = Aquadata.Core.Entity.User;
namespace Aquadata.UnitTests.Domain.Entity.User;


public class UserTest
{
  [Fact]
  public void CreateValidUser() 
  {
    var expected = new {
      FarmAddres = "address example",
      FarmName = "valid name",
      Name = "valid name",
      Email = "mail@example.com",
      Password = "password",
      Phone = "88912345678"
    };

    var user = CoreEntity.UserEntity.Of(
      farmAddress: expected.FarmAddres,
      farmName: expected.FarmName,
      name: expected.Name,
      email: expected.Email,
      password: expected.Password,
      phone: expected.Phone
    ).Unwrap();

    Assert.NotNull(user);
    Assert.NotEqual(user.Id, default);
    Assert.Equal(expected.FarmAddres, user.FarmAddress);
    Assert.Equal(expected.FarmName, user.FarmName);
    Assert.Equal(expected.Email, user.Email);
    Assert.Equal(expected.Password, user.Password);
    Assert.Equal(expected.Name, user.Name);
    Assert.Equal(expected.Phone, user.Phone);
  }

  [Fact]
  public void GivenInvalidParamsWhenCreateThrowError()
  {
    var resultList = new List<Result<UserEntity, EntityValidationException>>{
      GetUser.WithInvalidName(),
      GetUser.WithInvalidEmail(),
      GetUser.WithInvalidFarmAddress(),
      GetUser.WithInvalidFarmName(),
      GetUser.WithInvaliPassword(),
      GetUser.WithInvalidPhone()
    };

    foreach (var item in resultList)
    {
      Assert.Throws<EntityValidationException>(() => {
        item.Unwrap();
      });
    }
  }
}
