using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Entities.User;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.Infra.EF.Repositories;

public class UserRepository : IUserRepository
{
  private readonly ApplicationDbContext _dbContext;

  public UserRepository(ApplicationDbContext dbContext)
  {
    _dbContext = dbContext;
  }
  
  public Task Delete(UserEntity aggregate, CancellationToken cancellationToken)
    => Task.FromResult(_dbContext.Users.Remove(aggregate));

  public async Task<UserEntity?> Get(Guid id, CancellationToken cancellationToken)
    => await _dbContext.Users.AsNoTracking()
    .FirstOrDefaultAsync(e => e.Id == id);

  public async Task Insert(UserEntity aggregate, CancellationToken cancellationToken)
  {
    await _dbContext.Users.AddAsync(aggregate, cancellationToken);
  }

  public Task Update(UserEntity aggregate, CancellationToken cancellationToken)
    => Task.FromResult(_dbContext.Users.Update(aggregate));

  public async Task<bool> IsEmailRegistered(string email)
    => await _dbContext.Users.AnyAsync(u => u.Email.ToLower() == email.ToLower());

  public async Task<UserEntity?> GetByEmail(string email)
    => await _dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

  public async Task AddFeedPurchase(FeedPurchaseEntity feedPurchase)
    => await _dbContext.FeedPurchases.AddAsync(feedPurchase);

  public async Task AddProbioticPurchase(ProbioticsPurchaseEntity probioticPurchase)
    => await _dbContext.ProbioticPurchases.AddAsync(probioticPurchase);

  public async Task AddFertilizerPurchase(FertilizerPurchaseEntity fertilizerPurchase)
    => await _dbContext.FertilizerPurchases.AddAsync(fertilizerPurchase);
}
