using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.User.DeleteUser;

[CollectionDefinition(nameof(DeleteUserFixture))]
public class DeleteUserFixture: UserTestFixture
, ICollectionFixture<DeleteUserFixture>
{
}
