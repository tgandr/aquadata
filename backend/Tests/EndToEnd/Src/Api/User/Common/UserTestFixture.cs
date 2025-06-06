using Aquadata.Core.Entities.User;
using Aquadata.EndToEndTests.Api.Base;

namespace Aquadata.EndToEndTests.Api.User.Common;

public class UserTestFixture
: BaseFixture
{
  public UserPersistence Persistence {get;}

  public UserTestFixture()
  {
    Persistence = new UserPersistence(CreateDbContext());
  }

  public UserEntity GetUserExample()
    => UserEntity.Of(
      "name",
      $"{Guid.NewGuid()}@email.com",
      "password",
      "farmName",
      "farmAddres",
      "profile",
      "phone"
  ).Unwrap();
}
