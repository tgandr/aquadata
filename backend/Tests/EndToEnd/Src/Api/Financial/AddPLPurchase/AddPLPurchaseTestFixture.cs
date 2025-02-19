using Aquadata.Application.UseCases.Financial.AddPLPurchase;
using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Pond;
using Aquadata.EndToEndTests.Api.User.Common;

namespace Aquadata.EndToEndTests.Api.Financal.AddPLPurchase;

[CollectionDefinition(nameof(AddPLPurchaseTestFixture))]
public class AddPLPurchaseTestFixture
:UserTestFixture, ICollectionFixture<AddPLPurchaseTestFixture>
{
  public AddPLPurchaseInput GetInput(Guid userId, Guid cultivationId)
    => new("12/12/2020", "label", 12, 12m, userId, cultivationId);

  public PondEntity GetPondExample(Guid userId)
  {
    var pond = PondEntity.Of("name", 2f).Unwrap();
    pond.UserId = userId;

    return pond;
  }

  public CultivationEntity GetCultivationExample(Guid pondId)
  {
    var cultivation = CultivationEntity.Of(2, 2, "plorigin", 
    false, Core.Enums.CultivationUniformity.Acceptable, DateTime.Now).Unwrap();

    cultivation.PondId = pondId;

    return cultivation;
  }
}
