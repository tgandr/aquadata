using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Application.UseCases.Pond.DeactivatePond;
using Aquadata.Infra.EF;
using Aquadata.Infra.EF.Repositories;
using Aquadata.IntegrationTests.Application.Common;
using Aquadata.IntegrationTests.Application.UseCases.Pond.Common;
using UseCase = Aquadata.Application.UseCases.Pond.DeactivatePond;
namespace Aquadata.IntegrationTests.Application.UseCases.Pond.DeactivatePond;

public class DeactivatePondTest
{
  [Fact]
  public async void DeactivatePond()
  {
    var dbContext = ApplicationFixture.CreateDbContext();
    var repository = new PondRepository(dbContext);
    var uow = new UnitOfWork(dbContext);
    var useCase = new UseCase.DeactivatePond(repository, uow);
    var examplePond = PondTestFactory.GetValidPond();
    var tracking = dbContext.Ponds.Add(examplePond);
    dbContext.SaveChanges();
    tracking.State = Microsoft.EntityFrameworkCore.EntityState.Detached;
    var input = new DeactivatePondInput(examplePond.Id);

    var outputResult = await useCase.Handle(input, CancellationToken.None);
    var output = outputResult.Unwrap();
    var pondFromDb = await dbContext
      .Ponds.FindAsync(output.Id);

    Assert.NotNull(pondFromDb);
    Assert.False(pondFromDb.IsActive);
  }
}
