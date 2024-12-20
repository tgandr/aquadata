using Aquadata.Application.UseCases.Pond.UpdatePond;
using Aquadata.Core.Entities.Pond;
using Aquadata.Infra.EF;
using Aquadata.Infra.EF.Repositories;
using Aquadata.IntegrationTests.Application.Common;
using Aquadata.IntegrationTests.Application.UseCases.Pond.Common;
using UseCase = Aquadata.Application.UseCases.Pond.UpdatePond;

namespace Aquadata.IntegrationTests.Application.UseCases.Pond.UpdatePond;

public class UpdatePondTest
{
  [Theory]
  [MemberData(
    nameof(UpdatePondFixture.GetPondsToUpdate), 
    parameters: 5,
    MemberType = typeof(UpdatePondFixture)
  )]
  public async void UdatePond(PondEntity entity, UpdatePondInput input)
  {
    var dbContext = ApplicationFixture.CreateDbContext();
    var uow = new UnitOfWork(dbContext);
    var tracking = await dbContext.AddAsync(entity);
    dbContext.SaveChanges();
    tracking.State = Microsoft.EntityFrameworkCore.EntityState.Detached;
    var repository = new PondRepository(dbContext);
    var useCase = new UseCase.UpdatePond(repository, uow);

    var outputResult = await useCase.Handle(input,CancellationToken.None);
    var output = outputResult.Unwrap();

    var dbPond = await dbContext.Ponds.FindAsync(output.Id);

    Assert.NotNull(dbPond);
    Assert.Equal(input.Name, dbPond.Name);
    Assert.Equal(input.Area, dbPond.Area);
  }
}
