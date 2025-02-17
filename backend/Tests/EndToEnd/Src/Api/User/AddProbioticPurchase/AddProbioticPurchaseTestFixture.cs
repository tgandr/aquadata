using Aquadata.Application.Dtos;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.User.AddProbioticPurchase;

[CollectionDefinition(nameof(AddProbioticPurchaseTestFixture))]
public class AddProbioticPurchaseTestFixture: 
UserTestFixture, ICollectionFixture<AddProbioticPurchaseTestFixture>
{
  public ProbioticPurchaseDto GetInput()
    => new("20/12/2000", "label", 10, 10m, Core.Enums.MeasureUnit.g);
}
