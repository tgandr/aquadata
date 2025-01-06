using Aquadata.UnitTests.Application.Pond.Common;
using UseCase = Aquadata.Application.UseCases.Pond.DeactivatePond;
using Moq;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.UnitTests.Application.Common;
using Aquadata.Core.Entities.Pond;
using Aquadata.Application.UseCases.Pond.GetPond;
using Aquadata.Application.UseCases.Pond.DeactivatePond;

namespace Aquadata.UnitTests.Application.Pond.DeactivatePond;

public class DeactivatePondTest
{
  [Fact]
  public async void DeactivatePond()
  {
    var repositoryMock = PondTestFactory.GetRepositoryMock();
    var uowMock = ApplicationTestFactory.GetUnitOfWorkMock();
    var examplePond = PondTestFactory.GetValidPond();

    repositoryMock.Setup(repo => repo.Get(
      examplePond.Id,
      It.IsAny<CancellationToken>()
    )).ReturnsAsync(examplePond);

    var useCase = new UseCase.DeactivatePond(
      repositoryMock.Object,
      uowMock.Object
    );

    var input = new DeactivatePondInput(examplePond.Id);
    var outputResult = await useCase.Handle(input, CancellationToken.None);
    var output = outputResult.Unwrap();
    repositoryMock.Verify(
      repo => repo.Get(
        It.IsAny<Guid>(),
        It.IsAny<CancellationToken>()
      ),
      Times.Once
    );

    repositoryMock.Verify(
      repo => repo.Deactivate(
        examplePond,
        It.IsAny<CancellationToken>()
      ),
      Times.Once
    );

    Assert.NotNull(output);
    Assert.Equal(examplePond.Name, output.Name);
    Assert.Equal(examplePond.Area, output.Area);
    Assert.Equal(examplePond.CreatedAt, output.CreatedAt);
    Assert.Equal(examplePond.UpdatedAt, output.UpdatedAt);
  }
}
