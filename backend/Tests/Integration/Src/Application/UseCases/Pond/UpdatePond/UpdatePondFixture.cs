using Aquadata.Application.UseCases.Pond.UpdatePond;
using Aquadata.Core.Entities.Pond;

namespace Aquadata.IntegrationTests.Application.UseCases.Pond.UpdatePond;

public class UpdatePondFixture
{
  public static IEnumerable<object[]> GetPondsToUpdate(int times = 10)
  {
    for (var i = 0; i < times; i++)
    {
      var examplePond = PondEntity.Of($"name-{i}", 10f+i).Unwrap();
      var exampleInput = new UpdatePondInput(examplePond.Id, 
      $"pond-{i+2}", 10f+i+2);

      yield return new object[] { 
        examplePond,
        exampleInput 
      };
    }
  }
}
