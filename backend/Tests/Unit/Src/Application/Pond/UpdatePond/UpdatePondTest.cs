using Aquadata.Core.Entities.Pond;
using Aquadata.UnitTests.Application.Common;
using Aquadata.UnitTests.Application.Pond.Common;
using UseCase = Aquadata.Application.UseCases.Pond.UpdatePond;
using Moq;
using Unit.Src.Application.Pond.UpdatePond;

namespace Aquadata.UnitTests.Application.Pond.UpdatePond;

public class UpdatePondTest
{
  [Theory]
  [MemberData(
    nameof(PondTestFactory.GetPondCollection),
    parameters: 1,
    MemberType = typeof(PondTestFactory)
  )]
  public async void UpdatePond(PondEntity examplePond)
  {
    var repositoryMock = PondTestFactory.GetRepositoryMock();
    var uowMock = ApplicationTestFactory.GetUnitOfWorkMock();

    repositoryMock.Setup(repo => repo.Get(
      examplePond.Id,
      It.IsAny<CancellationToken>()
    )).ReturnsAsync(examplePond);

    var useCase = new UseCase.UpdatePond(
      repositoryMock.Object, 
      uowMock.Object);

    var input = UpdatePondTestFixture.GetInput(examplePond.Id);

    var outputResult = await useCase.Handle(input, CancellationToken.None);
    var output = outputResult.Unwrap();

    Assert.NotNull(output);
    Assert.Equal(output.Name, input.Name);
    Assert.Equal(output.Area, input.Area);

    repositoryMock.Verify(repo => repo.Get(
      examplePond.Id,
      It.IsAny<CancellationToken>()
    ), Times.Once);
    repositoryMock.Verify(repo => repo.Update(
      examplePond,
      It.IsAny<CancellationToken>()
    ), Times.Once);
    uowMock.Verify(repo => repo.Commit(
      It.IsAny<CancellationToken>()
    ), Times.Once);
  }
}
