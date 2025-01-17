using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Interfaces.Repository;
using Moq;

namespace Aquadata.UnitTests.Application.Pond.Common;

public class PondTestFactory
{
  public static PondEntity GetValidPond()
   => PondEntity.Of("valid_name", 10.5f, true).Unwrap();
  
  public static IEnumerable<object[]> GetPondCollection(int quantity = 10)
  {
    for (int i = 0; i < quantity; i++)
    {
      var pond = PondEntity.Of($"pond-{i}",10f+i, true);
      yield return new object [] {
        pond.Unwrap()
      };
    }
  }
  public static Mock<IPondRepository> GetRepositoryMock()
    => new();
}
