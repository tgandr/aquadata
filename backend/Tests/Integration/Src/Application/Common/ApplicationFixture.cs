using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.IntegrationTests.Application.Common;

public class ApplicationFixture
{
  public static ApplicationDbContext CreateDbContext(bool preserveData = false)
  {
    var options = new DbContextOptionsBuilder<ApplicationDbContext>()
      .UseInMemoryDatabase(Guid.NewGuid().ToString())
      .Options;

    var context = new ApplicationDbContext(options);

    if (!preserveData)
    {
      context.Database.EnsureDeleted();
    }

    return context;
  }
}
