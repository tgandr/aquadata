using Aquadata.Core.Interfaces;

namespace Aquadata.Core.SeedWork;

public interface IDeletableRepository<IAggregate> : IGenericRepository<IAggregate>
where IAggregate : IAggregateRoot
{
  Task Delete(IAggregate id, CancellationToken cancellationToken);
}
