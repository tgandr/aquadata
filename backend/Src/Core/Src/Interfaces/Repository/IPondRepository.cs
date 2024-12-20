using Aquadata.Core.Entities.Pond;
using Aquadata.Core.SeedWork;

namespace Aquadata.Core.Interfaces.Repository;

public interface IPondRepository: IGenericRepository<PondEntity>
{
  Task Deactivate(PondEntity pond, CancellationToken cancellationToken);
}
