using CoreEntity = Aquadata.Core.Entity.User;
namespace Aquadata.UnitTests.Domain.Entity.User;


public class UserTest
{
  [Fact]
  public void CreateValidUser() 
  {
    var expectedFarmAddres = "address example";
    var expectedFarmName = "valid name";
    var expectedName = "valid name";
    var expectedEmail = "mail@example.com";
    var expectedPassword = "password";
    var expectedPhone = "88912345678";

    var user = CoreEntity.UserEntity.Of(
      farmAddress: expectedFarmAddres,
      farmName: expectedFarmName,
      name: expectedName,
      email: expectedEmail,
      password: expectedPassword,
      phone: expectedPhone
    ).Unwrap();

    Assert.NotNull(user);
    Assert.NotEqual(user.Id, default);
    Assert.Equal(expectedFarmAddres, user.FarmAddress);
    Assert.Equal(expectedFarmName, user.FarmName);
    Assert.Equal(expectedEmail, user.Email);
    Assert.Equal(expectedPassword, user.Password);
    Assert.Equal(expectedName, user.Name);
    Assert.Equal(expectedPhone, user.Phone);
  }
}
