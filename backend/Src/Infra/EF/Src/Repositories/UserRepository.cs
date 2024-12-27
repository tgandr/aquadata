using Aquadata.Core.Entities.User;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Infra.EF.Context;

namespace Aquadata.Infra.EF.Repositories;

public class UserRepository : IUserRepository
{
  private readonly ApplicationDbContext _dbContext;

  public UserRepository(ApplicationDbContext dbContext)
  {
    _dbContext = dbContext;
  }
    public Task Delete(Guid id, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<UserEntity?> Get(Guid id, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task Insert(UserEntity aggregate, CancellationToken cancellationToken)
    {
      await _dbContext.Users.AddAsync(aggregate, cancellationToken);
    }

    public Task Update(UserEntity aggregate, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
