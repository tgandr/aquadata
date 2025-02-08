using Aquadata.Application.UseCases.Cultivation;
using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Enums;
using Aquadata.EndToEndTests.Api.Base;

namespace Aquadata.EndToEndTests.Api.Cultivation.Common;

public class CultivationFixture: BaseFixture
{
  public CultivationPersistence Persistence {get;}

  public CultivationFixture()
  {
    Persistence = new CultivationPersistence(
      CreateDbContext()
    );
  }

  public CultivationEntity GetCultivationExample(Guid pondId)
  {
    var result = CultivationEntity.Of(2,2,"plOrigin", false, 
    CultivationUniformity.Uneven, DateTime.Now).Unwrap();

    result.PondId = pondId;
    return result;
  }

  public PondEntity GetPondExample(Guid userId) 
  {
    var pond = PondEntity.Of("name", 10f).Unwrap();
    pond.UserId = userId;

    return pond;
  }
  public CreateCultivationInput GetExampleInput(Guid pondId)
    => new (2,2,"plOrigin", CultivationUniformity.Acceptable, 
    DateTime.Now, false, pondId);
}
