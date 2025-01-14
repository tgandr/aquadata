using Aquadata.Application.UseCases.Pond.UpdatePond;

namespace Unit.Src.Application.Pond.UpdatePond;

public class UpdatePondTestFixture
{
  public static UpdatePondInput GetInput(Guid id)
    => new UpdatePondInput(id,"Valid_name10", 2f, Guid.NewGuid());
}
