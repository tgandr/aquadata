using Aquadata.Application.UseCases.Financial.AddEmployeePayment;
using Aquadata.Core.Entities.Employee;
using Aquadata.EndToEndTests.Api.Financial.Common;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.Financal.AddEmployeePayment;

[CollectionDefinition(nameof(AddEmployeePaymentTestFixture))]
public class AddEmployeePaymentTestFixture
:FinancialFixture, ICollectionFixture<AddEmployeePaymentTestFixture>
{
  public EmployeeEntity GetEmployeeExample(Guid financialId)
  {
    var entity = EmployeeEntity.Of("name").Unwrap();
    entity.FinancialId = financialId;
    return entity;
  }
  
  public AddEmployeePaymentInput GetInput(Guid employeeId)
    => new("12/12/2012", 10m, employeeId);
}
