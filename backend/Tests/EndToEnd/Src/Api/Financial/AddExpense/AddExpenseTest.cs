using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.User.Common;

namespace Aquadata.EndToEndTests.Api.Financial.AddExpense;

[Collection(nameof(AddExpenseTestFixture))]
public class AddExpenseTest
{
  private readonly AddExpenseTestFixture _fixture;

  public AddExpenseTest(AddExpenseTestFixture fixture)
    => _fixture = fixture;

  [Fact]
  public async void AddExpense()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var pond = _fixture.GetPondExample(credentials.User.Id);
    var input = _fixture.GetInput(pond.Id);

    await _fixture.Persistence.Insert(pond);

    var (response, _) = await _fixture.ApiClient
    .Post<object>(
      "/financial/add-expense",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);

    var (_,output) = await _fixture.ApiClient
    .Get<ApiResponse<UserOutput>>(
      $"users/{credentials.User.Id}"
    );

    Assert.NotNull(output);
    Assert.NotNull(output.Data.Expenses);
    Assert.NotEmpty(output.Data.Expenses);
  }
}
