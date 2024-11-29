using Aquadata.Core.Entities.User;
using Aquadata.Core.Errors;
using Aquadata.Core.Util;
using Unit.Src.Domain.Entity.User;
namespace Aquadata.UnitTests.Core.Entities.User;


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
      Phone = "88912345678",
      Profile = "profile"
    };

    var user = UserEntity.Of(
      farmAddress: expected.FarmAddres,
      farmName: expected.FarmName,
      name: expected.Name,
      email: expected.Email,
      password: expected.Password,
      phone: expected.Phone,
      profile: expected.Profile
    ).Unwrap();

    Assert.NotNull(user);
    Assert.NotEqual(user.Id, default);
    Assert.Equal(expected.FarmAddres, user.FarmAddress);
    Assert.Equal(expected.FarmName, user.FarmName);
    Assert.Equal(expected.Email, user.Email);
    Assert.Equal(expected.Password, user.Password);
    Assert.Equal(expected.Name, user.Name);
    Assert.Equal(expected.Phone, user.Phone);
    Assert.Equal(expected.Profile, user.Profile);
  }

  [Fact]
  public void GivenInvalidParamsWhenCreateThrowError()
  {
    var resultList = new List<Result<UserEntity, ModelValidationException>>{
      GetUser.WithInvalidName(),
      GetUser.WithInvalidEmail(),
      GetUser.WithInvalidFarmAddress(),
      GetUser.WithInvalidFarmName(),
      GetUser.WithInvaliPassword(),
      GetUser.WithInvalidPhone(),
      GetUser.WithInvalidProfile()
    };

    foreach (var item in resultList)
    {
      Assert.Throws<ModelValidationException>(() => {
        item.Unwrap();
      });
    }
  }
}
