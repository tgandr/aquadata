using System.Net;

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
    var input = _fixture.GetInput(cultivatonExample.Id);

    await _fixture.Persistence.Insert(pondExample);
    await _fixture.Persistence.Insert(cultivatonExample);

    var (response,_) = await _fixture.ApiClient
    .Post<object>(
      "/cultivations/add-biometric",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);    
  }

  [Fact]
  public async Task NotFound()
  {
    var credentials = await _fixture.ApiClient.SignUp();
    var pondExample = _fixture.GetPondExample(credentials.User.Id);
    var cultivatonExample = _fixture.GetCultivationExample(pondExample.Id);
    var input = _fixture.GetInput(cultivatonExample.Id);
    
    await _fixture.Persistence.Insert(pondExample);

    var (response,_) = await _fixture.ApiClient
    .Post<object>(
      "/cultivations/add-biometric",
      input
    );

    Assert.NotNull(response);
    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);    

  }

  public void Dispose()
  {
    _fixture.CleanPersistence();
  }
}
