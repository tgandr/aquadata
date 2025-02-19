using Aquadata.EndToEndTests.Api.Base;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.Authorization;

[CollectionDefinition(nameof(AuthenticationTestFixture))]
public class AuthenticationTestFixture: 
BaseFixture, ICollectionFixture<AuthenticationTestFixture>
{
  public UserPersistence Persistence {get;}

  public AuthenticationTestFixture()
  {
    Persistence = new UserPersistence(
      CreateDbContext()
    );
  }
}
