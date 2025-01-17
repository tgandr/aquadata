using Aquadata.UnitTests.Application.Common;
using UseCase = Aquadata.Application.UseCases.Pond.CreatePond;
using Moq;
using Aquadata.Core.Entities.Pond;
using Aquadata.UnitTests.Application.Pond.Common;

namespace Aquadata.UnitTests.Application.Pond;

[Collection(nameof(CreatePondTestFixture))]
public class CreatePondTest
{
  private readonly CreatePondTestFixture _fixture;

  public CreatePondTest(CreatePondTestFixture fixture)
    => _fixture = fixture;

  [Fact]
  public async void CreatePond()
  {
    var repositoryMock = PondTestFactory.GetRepositoryMock();
    var uowMock = ApplicationTestFactory.GetUnitOfWorkMock();
    var useCase = new UseCase.CreatePond(
      repositoryMock.Object, uowMock.Object
    );
    var input = _fixture.GetInput();
    var outputResult = await useCase.Handle(input, CancellationToken.None);
    var output = outputResult.Unwrap();
    repositoryMock.Verify(
      repo => repo.Insert(
        It.IsAny<PondEntity>(),
        It.IsAny<CancellationToken>()
      ),
      Times.Once
    );

    uowMock.Verify(
      uow => uow.Commit(It.IsAny<CancellationToken>()),
      Times.Once
    );

    Assert.NotNull(output);
    Assert.NotEqual(output.Id, default);
    Assert.Equal(output.Name, input.Name);
    Assert.Equal(output.Area, input.Area);
    Assert.True(output.IsActive);
    Assert.NotEqual(output.CreatedAt, default);
    Assert.NotEqual(output.UpdatedAt, default);
  }
}
