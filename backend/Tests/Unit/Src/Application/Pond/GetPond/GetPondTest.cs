using UseCase = Aquadata.Application.UseCases.Pond.GetPond;
using Aquadata.UnitTests.Application.Pond.Common;
using Aquadata.Application.UseCases.Pond.Common;
using Moq;
using Aquadata.Application.UseCases.Pond.GetPond;

namespace Aquadata.UnitTests.Application.Pond.GetPond;

public class GetPondTest
{
  [Fact]
  public async void GetPond()
  {
    var repositoryMock = PondTestFactory.GetRepositoryMock();
    var examplePond = PondTestFactory.GetValidPond();

    repositoryMock.Setup(
      repo => repo.Get(
        It.IsAny<Guid>(),
        It.IsAny<CancellationToken>()
    )).ReturnsAsync(examplePond);

    var useCase = new UseCase.GetPond(
      repositoryMock.Object
    );
    var input = new GetPondInput(examplePond.Id);
    var outputResult = await useCase.Handle(input, CancellationToken.None);
    var output = outputResult.Unwrap();

    repositoryMock.Verify(
      repo => repo.Get(
        It.IsAny<Guid>(),
        It.IsAny<CancellationToken>()
      ),
      Times.Once
    );

    Assert.NotNull(output);
    Assert.NotEqual(output.Id, default);
    Assert.Equal(output.Name, examplePond.Name);
    Assert.Equal(output.Area, examplePond.Area);
    Assert.True(output.IsActive);
    Assert.NotEqual(output.CreatedAt, default);
    Assert.NotEqual(output.UpdatedAt, default);
  }
}
