using Aquadata.Infra.EF.Repositories;
using Aquadata.IntegrationTests.Application.Common;
using UseCase = Aquadata.Application.UseCases.Pond.GetPond;
using Aquadata.IntegrationTests.Application.UseCases.Pond.Common;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Application.UseCases.Pond.GetPond;

namespace Integration.Src.Application.UseCases.Pond.GetPond;

public class GetPondTest
{
  [Fact]
  public async void GetPond()
  {
    var examplePond = PondTestFactory.GetValidPond();
    var dbContext = ApplicationFixture.CreateDbContext();
    dbContext.Ponds.Add(examplePond);
    dbContext.SaveChanges();

    var pondRepository = new PondRepository(dbContext);
    var input = new GetPondInput(examplePond.Id);
    var useCase = new UseCase.GetPond(pondRepository);

    var outputResult = await useCase.Handle(input, CancellationToken.None);
    var output = outputResult.Unwrap();

    Assert.NotNull(output);
    Assert.Equal(examplePond.Id, output.Id);
    Assert.Equal(examplePond.Name, output.Name);
    Assert.Equal(examplePond.Area, output.Area);
    Assert.Equal(examplePond.IsActive, output.IsActive);
  }
}
