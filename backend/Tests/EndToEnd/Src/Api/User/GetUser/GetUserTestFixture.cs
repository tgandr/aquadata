using Aquadata.Application.UseCases.User.GetUser;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.User.GetUser;

[CollectionDefinition(nameof(GetUserTestFixture))]
public class GetUserTestFixture: UserTestFixture
, ICollectionFixture<GetUserTestFixture>
{
  public GetUserInput GetInput(Guid id)
  {
    return new GetUserInput(id);
  }
}
