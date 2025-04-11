using Aquadata.Core.Entities.Financial;
using Aquadata.Core.Entities.Inventory;
using Aquadata.Core.Entities.Stock;
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

  public async Task<bool> Exists(string email)
    => await _dbContext.Users.AnyAsync(u => u.Email.ToLower() == email.ToLower());

  public async Task<bool> Exists(Guid userId)
    => await _dbContext.Users.AnyAsync(u => u.Id == userId);

  public async Task<UserEntity?> GetByEmail(string email)
    => await _dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

  public async Task AddInventory(InventoryEntity inventory)
  => await _dbContext.Inventories.AddAsync(inventory);

  public async Task AddStock(StockEntity stock)
  => await _dbContext.Stocks.AddAsync(stock);

  public async Task Insert(FinancialEntity financial)
    => await _dbContext.Financials.AddAsync(financial);

  public async Task<ICollection<InventoryEntity>> GetInventories(Guid userId)
    => await _dbContext.Inventories.Where(i => i.UserId == userId).ToListAsync();

  public async Task<ICollection<StockEntity>> GetStocks(Guid userId)
    => await _dbContext.Stocks.Where(s => s.UserId == userId).ToListAsync();

}
