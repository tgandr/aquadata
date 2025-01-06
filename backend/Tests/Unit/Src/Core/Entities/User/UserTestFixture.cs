using Aquadata.Core.Entities.User;

using Aquadata.Core.Util;

namespace Unit.Src.Domain.Entity.User;

public class GetUser
{
  public static Result<UserEntity> WithInvalidName()
   => UserEntity.Of(
      farmAddress: "valid",
      farmName: "valid",
      name: "",
      email: "email@example.com",
      password: "password",
      phone: "88988888888",
      profile: "valid"
    );
  public static Result<UserEntity> WithInvalidEmail()
   => UserEntity.Of(
      farmAddress: "valid",
      farmName: "valid",
      name: "valid",
      email: "",
      password: "password",
      phone: "88988888888",
      profile: "valid"
    );
  public static Result<UserEntity> WithInvaliPassword()
   => UserEntity.Of(
      farmAddress: "valid",
      farmName: "valid",
      name: "valid",
      email: "email@example.com",
      password: "",
      phone: "88988888888",
      profile: "valid"
    );
  public static Result<UserEntity> WithInvalidPhone()
   => UserEntity.Of(
      farmAddress: "valid",
      farmName: "valid",
      name: "valid",
      email: "email@example.com",
      password: "password",
      phone: "",
      profile: "valid"
    );
  public static Result<UserEntity> WithInvalidFarmAddress()
   => UserEntity.Of(
      farmAddress: "",
      farmName: "valid",
      name: "valid",
      email: "email@example.com",
      password: "password",
      phone: "88988888888",
      profile: "valid"
    );
  public static Result<UserEntity> WithInvalidFarmName()
   => UserEntity.Of(
      farmAddress: "valid",
      farmName: "",
      name: "valid",
      email: "email@example.com",
      password: "password",
      phone: "88988888888",
      profile: "valid"
    );
  public static Result<UserEntity> WithInvalidProfile()
   => UserEntity.Of(
      farmAddress: "valid",
      farmName: "",
      name: "valid",
      email: "email@example.com",
      password: "password",
      phone: "88988888888",
      profile: ""
    );
}
