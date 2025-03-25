using Aquadata.EndToEndTests.Api.Base;

namespace Aquadata.EndToEndTests.Api.Financial.Common;

public class FinancialFixture: BaseFixture
{
  public FinancialPersistence Persistence{get;}

  public FinancialFixture()
  {
    Persistence = new FinancialPersistence(CreateDbContext());
  }
}
