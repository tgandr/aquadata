using Aquadata.Application.UseCases.Pond.CreatePond;

namespace Aquadata.IntegrationTests.Application.UseCases.Pond.CreatePond;

public class CreatePondFixture
{
  public static CreatePondInput GetInput()
    => new("name",10f, Guid.Empty);
}
