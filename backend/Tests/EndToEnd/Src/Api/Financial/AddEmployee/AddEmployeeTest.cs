using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.Financial.Common;
using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.EndToEndTests.Api.Financal.AddEmployee;

[Collection(nameof(AddEmployeeTestFixture))]
public class AddEmployeeTest
{
  private readonly AddEmployeeTestFixture _fixture;

  public AddEmployeeTest(AddEmployeeTestFixture fixture)
    => _fixture = fixture;

  [Fact]
  public async void AddEmployee()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var input = _fixture.GetInput();

    var (response, _) = await _fixture.ApiClient
    .Post<object>(
      "/financial/add-employee",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);

    var (_,output) = await _fixture.ApiClient
    .Get<ApiResponse<FinancialOutput>>(
      $"financial"
    );

    Assert.NotNull(output);
    Assert.NotNull(output.Data.Employees);
    Assert.NotEmpty(output.Data.Employees);
  }
}
