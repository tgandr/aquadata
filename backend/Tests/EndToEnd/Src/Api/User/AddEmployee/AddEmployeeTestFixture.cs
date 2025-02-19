using Aquadata.Application.Dtos;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.Financal.AddEmployee;

[CollectionDefinition(nameof(AddEmployeeTestFixture))]
public class AddEmployeeTestFixture
:UserTestFixture, ICollectionFixture<AddEmployeeTestFixture>
{
  public EmployeeDto GetInput()
    => new("name1");
}
