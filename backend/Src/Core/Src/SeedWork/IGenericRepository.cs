using Aquadata.Core.Interfaces;

namespace Aquadata.Core.SeedWork;

public interface IGenericRepository<TAggregate>: IRepository
  where TAggregate : IAggregateRoot
{
  Task Insert(TAggregate aggregate, CancellationToken cancellationToken);
  Task<TAggregate?> Get(Guid id, CancellationToken cancellationToken);
  Task Update(TAggregate aggregate, CancellationToken cancellationToken);
}
