using Aquadata.Infra.EF;
using UseCase = Aquadata.Application.UseCases.Pond.CreatePond;
using Aquadata.IntegrationTests.Application.Common;
using Aquadata.Infra.EF.Repositories;

namespace Aquadata.IntegrationTests.Application.UseCases.Pond.CreatePond;

public class CreatePondTest
{
  [Fact]
  public async Task CreatePond()
  {
    var dbContext = ApplicationFixture.CreateDbContext();
    var repository = new PondRepository(dbContext);
    var uow = new UnitOfWork(dbContext);
    var useCase = new UseCase.CreatePond(repository, uow);
    var input = CreatePondFixture.GetInput();

    var outputResult = await useCase.Handle(input, CancellationToken.None);
    var output = outputResult.Unwrap();
    var pondFromDb = await dbContext
      .Ponds.FindAsync(output.Id);

    Assert.NotNull(pondFromDb);
    Assert.Equal(input.Name, pondFromDb.Name);
    Assert.Equal(input.Area, pondFromDb.Area);
  }
}
