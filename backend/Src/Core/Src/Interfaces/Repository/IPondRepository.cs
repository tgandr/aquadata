using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Pond;
using Aquadata.Core.SeedWork;

namespace Aquadata.Core.Interfaces.Repository;

public interface IPondRepository: IGenericRepository<PondEntity>
{
  Task CreateCultivation(CultivationEntity cultivation, CancellationToken cancellationToken);
  Task<ICollection<PondEntity>> GetPondsByUser(Guid userId, CancellationToken cancellationToken);
  Task<bool> Exists(Guid userId, Guid pondId);
  Task Deactivate(PondEntity pond, CancellationToken cancellationToken);
}
