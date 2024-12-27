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
}
