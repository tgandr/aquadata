using System.Net;
using Aquadata.Api.Response;
using Aquadata.Application.Dtos;

namespace Aquadata.EndToEndTests.Api.Cultivation.AddBiometric;

[Collection(nameof(AddBiometricTestFixture))]
public class AddBiometricTest: IDisposable
{
  private readonly AddBiometricTestFixture _fixture;

  public AddBiometricTest(AddBiometricTestFixture fixture)
    => _fixture = fixture;

  [Fact]
  public async Task AddBiometric()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var pondExample = _fixture.GetPondExample(credentials.User.Id);
    var cultivatonExample = _fixture.GetCultivationExample(pondExample.Id);
    var inputList = _fixture.GetInputList(cultivatonExample.Id);

    await _fixture.Persistence.Insert(pondExample);
    await _fixture.Persistence.Insert(cultivatonExample);

    for (int i = 0; i < inputList.Count; i++)
    {
      var (response,_) = await _fixture.ApiClient
      .Post<ApiResponse<BiometricDto>>(
        "/cultivations/add-biometric",
        inputList[i]
      );

      Assert.NotNull(response);
      Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    var cultivationFromDb = await _fixture.Persistence.GetById(cultivatonExample.Id);

    Assert.NotNull(cultivationFromDb);
    Assert.NotNull(cultivationFromDb.Biometrics);
    Assert.Equal(inputList.Count, cultivationFromDb.Biometrics.Count);

  }

  [Fact]
  public async Task NotFound()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var pondExample = _fixture.GetPondExample(credentials.User.Id);
    var cultivatonExample = _fixture.GetCultivationExample(pondExample.Id);
    var input = _fixture.GetInputList(cultivatonExample.Id);
    
    await _fixture.Persistence.Insert(pondExample);

    var (response,_) = await _fixture.ApiClient
    .Post<object>(
      "/cultivations/add-biometric",
      input[0]
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);    

  }

  public void Dispose()
  {
    _fixture.CleanPersistence();
  }
}
