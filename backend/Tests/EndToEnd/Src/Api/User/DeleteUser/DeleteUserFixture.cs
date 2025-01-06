using Aquadata.Application.UseCases.User.Common;
using Aquadata.EndToEndTests.Api.Base;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.User.DeleteUser;

[CollectionDefinition(nameof(DeleteUserFixture))]
public class DeleteUserFixture: UserTestFixture
, ICollectionFixture<DeleteUserFixture>
{
}
