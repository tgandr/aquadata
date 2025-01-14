using Aquadata.Application.UseCases.User.UpdateUser;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.User.UpdateUser;

[CollectionDefinition(nameof(UpdateUserTestFixture))]
public class UpdateUserCollection
:ICollectionFixture<UpdateUserTestFixture>
{}

public class UpdateUserTestFixture: UserTestFixture
{
  public UpdateUserInput GetExampleInput(Guid id)
    => new UpdateUserInput(
      id,
      "newName",
      "newFarmName",
      "newFarmAddres",
      "newProfile",
      "newPhone"
    );
}
