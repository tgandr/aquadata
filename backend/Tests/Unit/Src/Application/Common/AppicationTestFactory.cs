using Aquadata.Application.Interfaces;
using Moq;

namespace Aquadata.UnitTests.Application.Common;

public class ApplicationTestFactory
{
  public static Mock<IUnitOfWork> GetUnitOfWorkMock()
    => new();

}
