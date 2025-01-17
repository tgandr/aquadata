using Application.UseCases.User.CreateUser;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.User.CreateUser;

[CollectionDefinition(nameof(CreateUserTestFixture))]
public class CreateUserCollection : ICollectionFixture<CreateUserTestFixture>
{ }

public class CreateUserTestFixture
: UserTestFixture
{
  public CreateUserInput GetExampleInput()
    => new("valid_name", "valid_email"+Guid.NewGuid(), "valid_password", "valid_farm_name", 
    "valid_farm_address", "valid_profile", "valid_phone");
}
