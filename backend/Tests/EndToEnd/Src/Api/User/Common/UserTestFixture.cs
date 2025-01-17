using Application.UseCases.User.CreateUser;
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

  public CreateUserInput GetUserExample()
  {
    return new (
      "name",
      $"{Guid.NewGuid()}@email.com",
      "password",
      "farmName",
      "farmAddres",
      "profile",
      "phone"
    );
  }
}
