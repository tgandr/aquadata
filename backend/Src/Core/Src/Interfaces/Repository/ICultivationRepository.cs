using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Objective;

namespace Aquadata.Core.Interfaces.Repository;

public interface ICultivationRepository
{
  Task<CultivationEntity?> Get(Guid id);
  Task<bool> Exists(string userId, string cultivationId);
  Task AddObjective(ObjectiveEntity objective);
}
