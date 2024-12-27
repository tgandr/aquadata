using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Entities.User;
using Aquadata.EndToEndTests.Api.Base;

namespace Aquadata.EndToEndTests.Api.Pond.Common;

public class PondTestFixture: BaseFixture
{

  public PondPersistence Persistence {get;}

  public PondTestFixture()
  {
    Persistence = new PondPersistence(CreateDbContext());
  }
  
  public UserEntity GetUserExample()
    => UserEntity.Of("valid_name", "valid_email", "valid_password", 
    "profile", "farmName", 
    "farmAddress", "phone").Unwrap();
  
}
