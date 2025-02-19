using Aquadata.Application.UseCases.User.AddEmployeePayment;
using Aquadata.Core.Entities.Employee;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.Financal.AddEmployeePayment;

[CollectionDefinition(nameof(AddEmployeePaymentTestFixture))]
public class AddEmployeePaymentTestFixture
:UserTestFixture, ICollectionFixture<AddEmployeePaymentTestFixture>
{
  public EmployeeEntity GetEmployeeExample(Guid userId)
  {
    var entity = EmployeeEntity.Of("name").Unwrap();
    entity.UserId = userId;

    return entity;
  }
  
  public AddEmployeePaymentInput GetInput(Guid employeeId)
    => new("12/12/2012", 10m, employeeId);
}
