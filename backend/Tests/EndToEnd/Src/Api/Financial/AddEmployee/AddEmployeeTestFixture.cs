using Aquadata.Application.Dtos;
using Aquadata.EndToEndTests.Api.Financial.Common;

namespace Aquadata.EndToEndTests.Api.Financal.AddEmployee;

[CollectionDefinition(nameof(AddEmployeeTestFixture))]
public class AddEmployeeTestFixture
:FinancialFixture, ICollectionFixture<AddEmployeeTestFixture>
{
  public EmployeeDto GetInput()
    => new("name1");
}
