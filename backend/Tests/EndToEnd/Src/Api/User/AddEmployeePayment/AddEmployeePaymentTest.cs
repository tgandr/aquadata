using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.EndToEndTests.Api.User.AddEmployeePayment;

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
    var employee = _fixture.GetEmployeeExample(credentials.User.Id);
    var input = _fixture.GetInput(employee.Id);

    await _fixture.Persistence.Insert(employee);

    var (response, _) = await _fixture.ApiClient
    .Post<object>(
      "/users/add-employee-payment",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);

    var (_,output) = await _fixture.ApiClient
    .Get<ApiResponse<UserOutput>>(
      $"users/{credentials.User.Id}"
    );

    Assert.NotNull(output);
    Assert.NotNull(output.Data.Payroll);
    Assert.NotEmpty(output.Data.Payroll);
  }


  [Fact]
  public async void NotFound()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var employee = _fixture.GetEmployeeExample(credentials.User.Id);
    var input = _fixture.GetInput(employee.Id);

    var (response, _) = await _fixture.ApiClient
    .Post<object>(
      "/users/add-employee-payment",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
  }
}
