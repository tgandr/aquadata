using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.Financial.Common;

namespace Aquadata.EndToEndTests.Api.Financal.AddEmployeePayment;

[Collection(nameof(AddEmployeePaymentTestFixture))]
public class AddEmployeePaymentTest
{
  private readonly AddEmployeePaymentTestFixture _fixture;

  public AddEmployeePaymentTest(AddEmployeePaymentTestFixture fixture)
    => _fixture = fixture;
  
  [Fact]
  public async void AddEmployeePayment()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var financialId = await _fixture.Persistence.GetFinancialId(credentials.User.Id);
    var employee = _fixture.GetEmployeeExample(financialId);
    var input = _fixture.GetInput(employee.Id);

    await _fixture.Persistence.Insert(employee);

    var (response, _) = await _fixture.ApiClient
    .Post<object>(
      "/financial/add-employee-payment",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);

    var (_,output) = await _fixture.ApiClient
    .Get<ApiResponse<FinancialOutput>>(
      $"financial"
    );

    Assert.NotNull(output);
    Assert.NotNull(output.Data.Payroll);
    Assert.NotEmpty(output.Data.Payroll);
  }


  [Fact]
  public async void NotFound()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var employee = _fixture.GetEmployeeExample(Guid.NewGuid());
    var input = _fixture.GetInput(employee.Id);

    var (response, _) = await _fixture.ApiClient
    .Post<object>(
      "/financial/add-employee-payment",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
  }
}
